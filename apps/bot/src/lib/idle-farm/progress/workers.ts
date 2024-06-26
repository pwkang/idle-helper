import type {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import messageReaders from '../message-readers';
import {userService} from '../../../services/database/user.service';
import {dailyReminder} from '../../idle-helper/reminder/daily-reminder';

interface IIdleWorker {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleWorker = async ({
  author,
  client,
  isSlashCommand,
  message
}: IIdleWorker) => {
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isIdleWorker({author, embed})) {
      idleWorkerSuccess({embed, author, client});
      dailyReminder({
        client,
        channelId: message.channel.id,
        userId: author.id
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
  embed: Embed;
}

const idleWorkerSuccess = async ({embed, author}: IIdleWorkerSuccess) => {
  const workers = messageReaders.worker({embed});
  await userService.saveUserWorkers({
    userId: author.id,
    workers
  });
};

interface IChecker {
  author: User;
  embed: Embed;
}

const isIdleWorker = ({author, embed}: IChecker) =>
  embed.author?.name === `${author.username} — workers`;
