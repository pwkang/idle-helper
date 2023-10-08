import type {Embed} from 'discord.js';
import ms from 'ms';

interface IGuildReader {
  embed: Embed;
}

export const _guildReader = ({embed}: IGuildReader) => {
  const name = embed.fields[0].name;
  const infoString = embed.fields[0].value;
  const playerCount = infoString.match(/\*\*Players\*\*: (\d+)/)?.[1] ?? '0';
  const rank = infoString.match(/\*\*Rank\*\*: #(\d+)/)?.[1] ?? '0';
  const honor = infoString.match(/\*\*Honor\*\*: (\d+)/)?.[1] ?? '0';
  const time = infoString.match(/\*\*(\d+h \d+m \d+s)\*\*/)?.[1];
  let readyIn = 0;
  if (time) {
    for (const t of time.split(' ')) {
      readyIn += ms(t);
    }
  }
  const raidedAmount =
    embed.footer?.text.match(/Your guild was raided (\d+)/)?.[1] ?? '0';
  return {
    name,
    playerCount: Number(playerCount),
    rank: Number(rank),
    honor: Number(honor),
    readyIn,
    raidedAmount: Number(raidedAmount)
  };
};
