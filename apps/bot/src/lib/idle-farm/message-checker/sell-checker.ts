import type {IChecker} from './type';

const isSold = ({message, author}: IChecker) =>
  message.mentions.users.has(author.id) &&
  message.content?.includes('successfully sold');

const hasNotEnoughItems = ({message, author}: IChecker) =>
  message.mentions.users.has(author.id) &&
  message.content?.includes('You don\'t have that much of this item to sell');

export const _sellChecker = {
  isSold,
  hasNotEnoughItems
};
