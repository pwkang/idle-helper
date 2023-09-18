import {Client, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import {userService} from '../../../services/database/user.service';

interface IUseTimeCompressor {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleUseTimeCompressor = ({author, client, isSlashCommand, message}: IUseTimeCompressor) => {
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('content', async (content, collected) => {
    if (isTimeCompressorUsed({author, message: collected})) {
      event.stop();
      await idleUseTimeCompressorSuccess({author, message: collected});
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleUseTimeCompressorSuccess {
  author: User;
  message: Message;
}

export const idleUseTimeCompressorSuccess = async ({author, message}: IIdleUseTimeCompressorSuccess) => {
  const amount = message.content?.match(/clicks a button on the (\d+)/)?.[1];

  if (!amount) return;

  await userService.addTimeCompressorUsage({
    userId: author.id,
    amount: Number(amount),
  });
};

interface IChecker {
  author: User;
  message: Message;
}

export const isTimeCompressorUsed = ({author, message}: IChecker) =>
  [author.username, 'time compressor', 'were added to your farms!'].every((text) => message.content.includes(text));
