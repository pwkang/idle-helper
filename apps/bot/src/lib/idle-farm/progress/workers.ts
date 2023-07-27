import {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import embedReaders from '../embed-readers';
import {userService} from '../../../services/database/user.service';
import {infoService} from '../../../services/database/info.service';

interface IIdleWorker {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleWorker = async ({author, client, isSlashCommand, message}: IIdleWorker) => {
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isIdleWorker({author, embed})) {
      idleWorkerSuccess({embed, author, client});
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleWorkerSuccess {
  client: Client;
  author: User;
  embed: Embed;
}

const idleWorkerSuccess = async ({embed, author}: IIdleWorkerSuccess) => {
  const workers = embedReaders.worker({embed});
  await userService.saveUserWorkers({
    userId: author.id,
    workers,
  });
  await updateWorkersPower(workers);
};

interface IChecker {
  author: User;
  embed: Embed;
}

const isIdleWorker = ({author, embed}: IChecker) =>
  embed.author?.name === `${author.username} — workers`;

const updateWorkersPower = async (userWorkers: ReturnType<typeof embedReaders.worker>) => {
  for (let worker of userWorkers) {
    await infoService.updateWorkerPower({
      worker: worker.type,
      power: worker.power,
      level: worker.level,
    });
  }
};