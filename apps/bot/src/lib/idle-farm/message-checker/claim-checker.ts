import type {IEmbedChecker} from './type';

const isIdleClaimSuccess = ({author, embed}: IEmbedChecker) =>
  embed.author?.name === `${author.username} — claim`;

const isBoosted = ({embed}: IEmbedChecker) =>
  embed.description?.includes('Extra items thanks to the boost!');


export const _claimChecker = {
  isIdleClaimSuccess,
  isBoosted
};
