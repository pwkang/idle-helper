import type {Embed} from 'discord.js';
import ms from 'ms';

export const _voteReader = (embed: Embed) => {
  const cooldown = embed.fields[0]?.value?.match(
    /Cooldown: \*\*(\d+h \d+m \d+s)\*\*/
  )?.[1];

  const readyIn = cooldown
    ? cooldown
      .split(' ')
      .map(ms)
      .reduce((a, b) => a + b, 0)
    : 0;

  const streak = embed.fields[1]?.value?.match(
    /Current streak: \*\*(\d+)\/7\*\*/
  )?.[1];

  return {
    readyIn,
    streak: streak ? Number(streak) : 0
  };
};
