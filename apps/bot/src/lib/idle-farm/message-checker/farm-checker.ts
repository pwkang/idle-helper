import type {IEmbedChecker} from './type';

const isFarm = ({author, embed}: IEmbedChecker) =>
  embed.author?.name === `${author.username} — farms` && embed.description?.includes('These are your farms');


export const _farmChecker = {
  isFarm
};
