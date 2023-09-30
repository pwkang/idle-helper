import {IEmbedChecker} from './type';

const isInventory = ({embed, author}: IEmbedChecker) =>
  embed.author?.name === `${author.username} — inventory`;


export const _inventoryChecker = {
  isInventory,
};