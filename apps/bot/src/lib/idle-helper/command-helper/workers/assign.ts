import type {Client, Message, User} from 'discord.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {djsMessageHelper} from '../../../discordjs/message';
import {createIdleFarmCommandListener} from '../../../../utils/idle-farm-command-listener';
import {messageChecker} from '../../../idle-farm/message-checker';
import messageReaders from '../../../idle-farm/message-readers';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_FARM_TYPE, IDLE_FARM_WORKER_TYPE, PREFIX} from '@idle-helper/constants';
import type {IUser} from '@idle-helper/models';
import ms from 'ms';

interface IWorkerAssign {
  client: Client;
  author: User;
  message: Message;
}

interface IReadFarms {
  message: Message;
}

interface PreferenceFarm {
  farm?: keyof typeof IDLE_FARM_FARM_TYPE;
  id?: string;
  targetWorker?: ValuesOf<typeof IDLE_FARM_WORKER_TYPE> | null;
  assignedWorker?: ValuesOf<typeof IDLE_FARM_WORKER_TYPE> | null;
  assigned: boolean;
  level: number;
}

export const _workerAssign = async ({message, author, client}: IWorkerAssign) => {
  const userAccount = await userService.findUser({userId: author.id});
  if (!userAccount) return;

  if (!userAccount.lastUpdated.workers) {
    const embed = new EmbedBuilder()
      .setColor(BOT_COLOR.embed)
      .setDescription('Please register your workers and use this command again');
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {
        embeds: [embed]
      }
    });
    return;
  }
  await collectUserFarms({
    userAccount,
    author,
    client,
    message
  });
};

interface ICollectFarms {
  message: Message;
  client: Client;
  author: User;
  userAccount: IUser;
}

const collectUserFarms = async ({message, client, author, userAccount}: ICollectFarms) => {
  await djsMessageHelper.send({
    client,
    channelId: message.channel.id,
    options: {
      embeds: [
        embedMessage('Type `idle farm` and show all farms')
      ]
    }
  });


  const preferenceFarms: PreferenceFarm[] = [];
  const registeredPage = new Set<number>();


  let idleEvent = createIdleFarmCommandListener({
    author,
    channelId: message.channel.id,
    client
  });
  if (!idleEvent) return;
  idleEvent.on('embed', (embed, collected) => {
    if (messageChecker.farm.isFarm({embed, author})) {
      collectFarms({message: collected});
    }
  });
  idleEvent.on('end', () => {
    idleEvent = undefined;
  });

  const collectFarms = async ({message}: IReadFarms) => {
    readFarms(message);
    const farmEvent = await createMessageEditedListener({
      messageId: message.id
    });
    if (!farmEvent) return;
    const editedHandler = (collected: Message) => {
      const isRegisteredAll = readFarms(collected);
      if (isRegisteredAll)
        farmEvent?.off(message.id, editedHandler);

    };
    farmEvent.on(message.id, editedHandler);
  };

  const readFarms = (message: Message) => {
    const farmInfo = messageReaders.farm({embed: message.embeds[0]});
    if (registeredPage.has(farmInfo.currentPage)) return false;
    farmInfo.farms.forEach(farm => {
      if (preferenceFarms.every(f => f.id !== farm.id)) {
        preferenceFarms.push({
          farm: farm.farm,
          assignedWorker: null,
          assigned: false,
          id: farm.id,
          level: farm.level
        });
      }
    });
    registeredPage.add(farmInfo.currentPage);
    if (registeredPage.size === farmInfo.maxPage) {
      collectPreferenceFarms({
        userAccount,
        author,
        client,
        preferenceFarms,
        message
      });
      return true;
    }
    return false;
  };
};

interface ICollectPreferenceFarms {
  message: Message;
  client: Client;
  preferenceFarms: PreferenceFarm[];
  userAccount: IUser;
  author: User;
}

const collectPreferenceFarms = async ({
  message,
  client,
  preferenceFarms,
  userAccount,
  author
}: ICollectPreferenceFarms) => {
  let event = await djsMessageHelper.interactiveSend({
    client,
    channelId: message.channel.id,
    options: {
      embeds: [
        generateSetEmbed({preferenceFarms, author})
      ],
      components: generateSetComponents({preferenceFarms, workers: userAccount.workers})
    },
    onEnd: () => {
      event = undefined;
    }
  });
  if (!event) return;
  event.every(async (interaction, customId) => {
    const type = customId.split(':')[0];
    if (type === 'set') {
      const workerType = customId.split(':')[1] as ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
      const nextFarm = preferenceFarms.find(farm => !farm.assigned);
      if (!nextFarm) return null;
      nextFarm.targetWorker = workerType;
      nextFarm.assigned = true;
    }
    if (type === 'delete') {
      const previousFarm = preferenceFarms.filter(farm => farm.assigned).reverse()[0];
      if (!previousFarm) return null;
      previousFarm.targetWorker = null;
      previousFarm.assigned = false;
    }
    if (type === 'skip') {
      const nextFarm = preferenceFarms.find(farm => !farm.assigned);
      if (!nextFarm) return null;
      nextFarm.targetWorker = null;
      nextFarm.assigned = true;
    }
    if (type === 'confirm') {
      startAssign({message, client, author, preferenceFarms, userAccount});
      event?.stop();
      return {
        embeds: [
          generateSetEmbed({preferenceFarms, author})
        ],
        components: generateSetComponents({preferenceFarms, workers: userAccount.workers, ended: true})
      };
    }
    if (type === 'abort') {
      event?.stop();
      return {
        embeds: [
          generateSetEmbed({preferenceFarms, author})
        ],
        components: generateSetComponents({preferenceFarms, workers: userAccount.workers, ended: true})
      };
    }
    return {
      embeds: [
        generateSetEmbed({preferenceFarms, author})
      ],
      components: generateSetComponents({preferenceFarms, workers: userAccount.workers})
    };
  });
};


const embedMessage = (content: string) => new EmbedBuilder().setColor(BOT_COLOR.embed).setDescription(content);

interface IGenerateSetEmbed {
  preferenceFarms: PreferenceFarm[];
  author: User;
}

const generateSetEmbed = ({preferenceFarms, author}: IGenerateSetEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: 'Worker Assign Helper',
    iconURL: author.displayAvatarURL()
  });

  const row: string[] = [];
  const currentFarm = preferenceFarms.find(farm => !farm.assigned);
  for (const preferenceFarm of preferenceFarms) {
    const farmType = preferenceFarm.farm;
    const farmEmoji = farmType ? BOT_EMOJI.farm[farmType] : ':person_shrugging:';
    const farmName = farmType ? IDLE_FARM_FARM_TYPE[farmType] : 'unknown';
    const farmLevel = preferenceFarm.level;
    const assignWorker = preferenceFarm.targetWorker;
    const assignWorkerEmoji = assignWorker ? BOT_EMOJI.worker[assignWorker] : ':no_entry_sign:';
    const divider = currentFarm?.id === preferenceFarm.id ? ':point_right:' : '~-~';
    row.push(`${farmEmoji} **${farmName} Lv${farmLevel}** ${divider} ${assignWorkerEmoji}`);
  }
  embed.setDescription(row.join('\n'));
  return embed;
};

interface IGenerateSetComponents {
  preferenceFarms: PreferenceFarm[];
  workers: IUser['workers'];
  ended?: boolean;
}

const generateSetComponents = ({preferenceFarms, workers, ended = false}: IGenerateSetComponents) => {
  const components: ButtonBuilder[] = [];

  const isAllAssigned = preferenceFarms.every(farm => farm.assigned);
  const isAssignedOne = preferenceFarms.some(farm => farm.assigned);
  const isAssignedOneWorker = preferenceFarms.some(farm => farm.assigned && farm.targetWorker);
  for (const workerType of Object.values(IDLE_FARM_WORKER_TYPE).reverse()) {
    const worker = workers[workerType];
    if (!worker) continue;
    const isWorkerAssign = preferenceFarms.some(farm => farm.targetWorker === workerType);
    const button = new ButtonBuilder()
      .setCustomId(`set:${workerType}`)
      .setEmoji(BOT_EMOJI.worker[workerType])
      .setLabel('\u200b')
      .setDisabled(isWorkerAssign || isAllAssigned || ended)
      .setStyle(ButtonStyle.Secondary);
    components.push(button);
  }
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  for (let i = 0; i < components.length; i += 4) {
    rows.push(
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents(...components.slice(i, i + 4))
    );
  }
  const actionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('\u200b')
        .setEmoji(BOT_EMOJI.utils.noEntry)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(isAllAssigned || ended)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('delete')
        .setEmoji(BOT_EMOJI.utils.backspace)
        .setLabel('\u200b')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!isAssignedOne || ended)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Success)
        .setDisabled(ended || !isAssignedOneWorker)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('abort')
        .setLabel('Abort')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(ended)
    );
  rows.push(actionRow);
  return rows;

};

interface IStartAssign {
  message: Message;
  client: Client;
  author: User;
  preferenceFarms: PreferenceFarm[];
  userAccount: IUser;
}

const startAssign = async ({message, client, author, preferenceFarms, userAccount}: IStartAssign) => {
  await djsMessageHelper.send({
    client,
    channelId: message.channel.id,
    options: {
      embeds: [
        generatedAssignEmbed({preferenceFarms, author})
      ]
    }
  });

  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
    readAuthorMessage: true
  });
  if (!event) return;
  event.on('content', (content) => {
    if (messageChecker.workerAssign.isSuccessfulAssigned(content)) {
      event?.resetTimer(ms('3m'));
      const workerAssignInfo = messageReaders.workerAssign({content});
      const farm = preferenceFarms.find(farm => farm.id === workerAssignInfo.farmId);
      if (!farm) return;
      farm.assignedWorker = workerAssignInfo.workerType;
      djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          embeds: [
            generatedAssignEmbed({preferenceFarms, author})
          ]
        }
      });
      if (preferenceFarms.every(farm => farm.assignedWorker)) {
        djsMessageHelper.send({
          client,
          channelId: message.channel.id,
          options: {
            embeds: [
              new EmbedBuilder().setColor(BOT_COLOR.embed).setDescription('All workers assigned')
            ]
          }
        });
        event?.stop();
      }
    }
  });
  event.on('author', (content) => {
    if (content.toLowerCase() === 'stop') {
      event?.stop();
      djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          embeds: [
            new EmbedBuilder().setColor(BOT_COLOR.embed).setDescription('Session ended')
          ]
        }
      });
    }
  });
  event.on('end', () => {
    event = undefined;
  });
};

interface IGeneratedAssignEmbed {
  preferenceFarms: PreferenceFarm[];
  author: User;
}

const generatedAssignEmbed = ({preferenceFarms, author}: IGeneratedAssignEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: 'Worker Assign Helper',
    iconURL: author.displayAvatarURL()
  });

  for (const farm of preferenceFarms) {
    if (!farm.targetWorker || farm.assignedWorker || !farm.id) continue;
    const workerType = farm.targetWorker;
    const farmId = farm.id;
    embed.addFields({
      name: '\u200b',
      value: `${PREFIX.idleFarm}wo assign ${workerType} ${farmId}`
    });
  }

  embed.setFooter({
    text: 'Type `stop` to abort'
  });

  return embed;


};
