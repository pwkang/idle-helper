import {Client, Embed, EmbedBuilder, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import embedReaders from '../embed-readers';
import {userService} from '../../../services/database/user.service';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {djsMessageHelper} from '../../discordjs/message';
import {typedObjectEntries} from '@idle-helper/utils';
import {calcWorkerPower} from '../calculator/worker-power';
import {redisDailyReminder} from '../../../services/redis/daily-reminder.redis';

interface IIdleDaily {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleDaily = async ({author, client, isSlashCommand, message}: IIdleDaily) => {
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isIdleDaily({author, embed})) {
      idleDailySuccess({author});
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleDailySuccess {
  author: User;
}

const idleDailySuccess = async ({author}: IIdleDailySuccess) => {
  await redisDailyReminder.claim(author.id);
};

interface IChecker {
  author: User;
  embed: Embed;
}

const isIdleDaily = ({author, embed}: IChecker) =>
  embed.author?.name === `${author.username} — daily reward`;
