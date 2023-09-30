import {IChecker} from './type';

const isBought = ({message, author}: IChecker) =>
  message.mentions.users.has(author.id) &&
  message.content?.includes('successfully bought');

export const _buyChecker = {
  isBought,
};