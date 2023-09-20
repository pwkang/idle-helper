import {Client, Embed, EmbedBuilder, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import messageReaders from '../message-readers';
import {userService} from '../../../services/database/user.service';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';
import {djsMessageHelper} from '../../discordjs/message';
import {calcWorkerPower} from '../calculator/worker-power';
import {dailyReminder} from '../../idle-helper/reminder/daily-reminder';
import toggleUserChecker from '../../idle-helper/toggle-checker/user';
import {createMessageEditedListener} from '../../../utils/message-edited-listener';
import {calcWorkerDmg} from '../calculator/calcWorkerDmg';

interface IIdleRaid {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleRaid = async ({author, client, isSlashCommand, message}: IIdleRaid) => {
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isIdleRaid({author, embed})) {
      idleRaidSuccess({raidMessage: collected, author, client, channelId: message.channel.id});
      dailyReminder({
        client,
        channelId: message.channel.id,
        userId: author.id,
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleWorkerSuccess {
  client: Client;
  author: User;
  channelId: string;
  raidMessage: Message;
}

const idleRaidSuccess = async ({author, client, channelId, raidMessage}: IIdleWorkerSuccess) => {
  const userToggle = await toggleUserChecker({userId: author.id});
  if (!userToggle?.raidHelper) return;
  const userWorker = await userService.getUserWorkers({userId: author.id});
  const registeredWorkersAmount = Object.values(userWorker).filter(Boolean).length;
  if (!registeredWorkersAmount) {
    return djsMessageHelper.send({
      client,
      channelId,
      options: {
        content: 'You may need to register your workers to use raid helper',
      },
    });
  }
  const guideEmbed = generateEmbed({
    userWorkers: userWorker,
    raidMessage,
  });
  const sentMessage = await djsMessageHelper.send({
    client,
    channelId,
    options: {
      embeds: [guideEmbed],
    },
  });
  if (!sentMessage) return;
  const event = await createMessageEditedListener({
    messageId: raidMessage.id,
  });
  event.on(raidMessage.id, async (message) => {
    const guideEmbed = generateEmbed({
      userWorkers: userWorker,
      raidMessage: message,
    });
    await djsMessageHelper.edit({
      client,
      message: sentMessage,
      options: {
        embeds: [guideEmbed],
      },
    });
  });
};

interface IChecker {
  author: User;
  embed: Embed;
}

const isIdleRaid = ({author, embed}: IChecker) =>
  embed.author?.name === `${author.username} — raid`;

interface IGenerateEmbed {
  raidMessage: Message;
  userWorkers: IUser['workers'];
}

const generateEmbed = ({userWorkers, raidMessage}: IGenerateEmbed) => {
  const raidInfo = messageReaders.raid({message: raidMessage});
  const {enemyFarms, workers} = raidInfo;
  const currentEnemy = enemyFarms.find((farm) => farm.health);
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);
  const workersInfo: string[] = [];
  for (const {type} of workers) {
    const workerInfo = userWorkers[type];
    if (!workerInfo) continue;
    const power = calcWorkerPower({
      type,
      level: workerInfo.level,
      decimalPlace: 2,
    });
    const enemyPower = currentEnemy
      ? calcWorkerPower({
        type: currentEnemy.worker,
        decimalPlace: 2,
        level: currentEnemy.level,
      })
      : null;
    const damage = enemyPower
      ? calcWorkerDmg({
        type: 'player',
        atk: power,
        def: enemyPower,
      })
      : '-';
    const value = `${BOT_EMOJI.worker[type]} Lv ${workerInfo.level} | AT: ${power} | DMG: ${damage}`;
    const isWorkerUsed = workers.find((w) => w.type === type)?.used;
    workersInfo.push(isWorkerUsed ? `~~${value}~~` : value);
  }
  embed.addFields({
    name: `${BOT_EMOJI.other.farm} Your farms`,
    value: workersInfo.join('\n'),
    inline: true,
  });

  const enemyFarmsInfo: string[] = [];
  for (const farm of enemyFarms) {
    const isCurrentEnemy = farm.worker === currentEnemy?.worker;
    const {worker, level, health} = farm;
    const power = calcWorkerPower({
      type: worker,
      level,
      decimalPlace: 2,
    });
    const value = `${BOT_EMOJI.worker[worker]}Lv ${level} | AT: ${power}`;
    enemyFarmsInfo.push(health ? (isCurrentEnemy ? `**${value}**` : value) : `~~${value}~~`);
  }
  embed.addFields({
    name: `${BOT_EMOJI.other.farm} Enemy farms`,
    value: enemyFarmsInfo?.length ? enemyFarmsInfo.join('\n') : 'No workers found',
    inline: true,
  });
  return embed;
};
