import {Client, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import {userService} from '../../../services/database/user.service';
import claimReminder from '../../idle-helper/reminder/claim-reminder';

interface IUseTimeSpeeder {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleUseTimeSpeeder = ({author, client, isSlashCommand, message}: IUseTimeSpeeder) => {
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('content', async (content, collected) => {
    if (isTimeSpeederUsed({author, message: collected})) {
      event.stop();
      await idleUseTimeSpeederSuccess({author, message: collected});
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleUseTimeSpeederSuccess {
  author: User;
  message: Message;
}

export const idleUseTimeSpeederSuccess = async ({author, message}: IIdleUseTimeSpeederSuccess) => {
  const amount = message.content?.match(/clicks a button on the (\d+)/)?.[1];

  if (!amount) return;
  await userService.addTimeSpeederUsage({
    userId: author.id,
    amount: Number(amount),
  });

  await claimReminder.update({
    userId: author.id,
  });
};

interface IChecker {
  author: User;
  message: Message;
}

export const isTimeSpeederUsed = ({author, message}: IChecker) =>
  [author.username, 'time speeder', 'were added to your farms!'].every((text) => message.content.includes(text));
