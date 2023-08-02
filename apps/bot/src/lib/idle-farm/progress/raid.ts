import {Client, Embed, EmbedBuilder, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import embedReaders from '../embed-readers';
import {userService} from '../../../services/database/user.service';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {djsMessageHelper} from '../../discordjs/message';
import {typedObjectEntries} from '@idle-helper/utils';
import {calcWorkerPower} from '../calculator/worker-power';
import {dailyReminder} from '../../idle-helper/reminder/daily-reminder';
import toggleUserChecker from '../../idle-helper/toggle-checker/user';

interface IIdleRaid {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleRaid = async ({author, client, isSlashCommand, message}: IIdleRaid) => {
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isIdleRaid({author, embed})) {
      idleRaidSuccess({embed, author, client, channelId: message.channel.id});
      dailyReminder({
        client,
        channelId: message.channel.id,
        userId: author.id,
      });
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleWorkerSuccess {
  client: Client;
  author: User;
  embed: Embed;
  channelId: string;
}

const idleRaidSuccess = async ({embed, author, client, channelId}: IIdleWorkerSuccess) => {
  const userToggle = await toggleUserChecker({userId: author.id});
  if (!userToggle?.raidHelper) return;
  const raidInfo = embedReaders.raid({embed});
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
    enemyFarms: raidInfo,
    userWorkers: userWorker,
  });
  await djsMessageHelper.send({
    client,
    channelId,
    options: {
      embeds: [guideEmbed],
    },
  });
};

interface IChecker {
  author: User;
  embed: Embed;
}

const isIdleRaid = ({author, embed}: IChecker) =>
  embed.author?.name === `${author.username} — raid`;

interface IGenerateEmbed {
  enemyFarms: ReturnType<typeof embedReaders.raid>;
  userWorkers: IUser['workers'];
}

const generateEmbed = ({userWorkers, enemyFarms}: IGenerateEmbed) => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .addFields(
      {
        name: `${BOT_EMOJI.other.farm} Your farms`,
        value: typedObjectEntries(IDLE_FARM_WORKER_TYPE).reverse().map(([key, value]) => {
          const worker = userWorkers[value];
          if (!worker) return undefined;
          return `${BOT_EMOJI.worker[value]} Lv ${worker.level} | AT: ${calcWorkerPower({
            type: value,
            level: worker.level,
          })}`;
        }).filter(Boolean).join('\n'),
        inline: true,
      },
      {
        name: `${BOT_EMOJI.other.farm} Enemy farms`,
        value: enemyFarms.map(({farm, worker, level}) =>
          `${BOT_EMOJI.worker[worker]} Lv ${level} | AT: ${calcWorkerPower({type: worker, level})}`,
        ).join('\n'),
        inline: true,
      },
    );
};