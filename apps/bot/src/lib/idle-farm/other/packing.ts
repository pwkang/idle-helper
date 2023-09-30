import {Client, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import messageReaders from '../message-readers';
import {userService} from '../../../services/database/user.service';
import {messageChecker} from '../message-checker';

interface IIdlePacking {
  client: Client;
  author: User;
  message: Message;
  isSlashCommand?: boolean;
}

export const idlePacking = ({message, client, isSlashCommand, author}: IIdlePacking) => {
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('content', async (content, collected) => {
    if (messageChecker.packing.isIdlePacking({message: collected, author})) {
      event?.stop();
      idlePackingSuccess({
        author,
        message: collected,
      });
    }
    if (messageChecker.packing.isFail({message: collected, author})) {
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdlePackingSuccess {
  message: Message;
  author: User;
}

const idlePackingSuccess = async ({message, author}: IIdlePackingSuccess) => {
  const packingResult = messageReaders.packing(message);
  if (packingResult.multiplier === 1) return;
  await userService.updatePackingMultiplier({
    userId: author.id,
    multiplier: packingResult.multiplier,
  });
};
