import {IEmbedChecker} from './type';

const isProfile = ({embed, author}: IEmbedChecker) =>
  embed.author?.name === `${author.username} — profile`;

export const _profileChecker = {
  isProfile,
};