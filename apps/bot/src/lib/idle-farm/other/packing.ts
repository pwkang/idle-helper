import {Client, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import messageReaders from '../message-readers';
import {userService} from '../../../services/database/user.service';

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
    if (isIdlePacking({message: collected, author})) {
      event?.stop();
      idlePackingSuccess({
        author,
        message: collected,
      });
    }
    if (isFail({message: collected, author})) {
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
  await userService.updatePackingMultiplier({
    userId: author.id,
    multiplier: packingResult.multiplier,
  });
};

interface IChecker {
  message: Message;
  author: User;
}

const isFail = ({message, author}: IChecker) =>
  isNotValidItem({message, author}) ||
  isNotEnoughItems({message, author});

const isNotEnoughItems = ({message, author}: IChecker) =>
  message.mentions.users.has(author.id) &&
  message.content?.includes('You don\'t have enough of this item to do this');

const isNotValidItem = ({author, message}: IChecker) =>
  message.mentions.users.has(author.id) &&
  message.content?.includes('That\'s not an item or it cannot be packed into boxes');

const isIdlePacking = ({message, author}: IChecker) =>
  message.mentions.users.has(author.id) &&
  message.content?.includes('successfully converted');
