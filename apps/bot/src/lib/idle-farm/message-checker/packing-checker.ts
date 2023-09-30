import {IChecker} from './type';

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

export const _packingChecker = {
  isFail,
  isNotEnoughItems,
  isNotValidItem,
  isIdlePacking,
};