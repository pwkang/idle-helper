import type {Embed} from 'discord.js';
import {IDLE_FARM_LEAGUE} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface IProfileReader {
  embed: Embed;
}

export const _profileReader = ({embed}: IProfileReader) => {
  const [energy, totalEnergy] = embed.fields[0].value
    .match(/<:energy:\d+> (\d+)\/(\d+)/)
    ?.slice(1, 3) ?? ['0', '0'];
  const packing =
    embed.fields[2].value.match(/<:box:\d+> Lv (\d+)/)?.[1] ?? '0';
  const farms = embed.fields[1].value.match(/\*\*Farms\*\*: (\d+)/)?.[1] ?? '0';
  const workers =
    embed.fields[1].value.match(/\*\*Workers\*\*: (\d+)/)?.[1] ?? '0';
  const idlons =
    embed.fields[3].value.match(/\*\*Idlons\*\*: ([\d,]+)/)?.[1] ?? '0';
  const idlucks =
    embed.fields[3].value.match(/\*\*Idlucks\*\*: ([\d,]+)/)?.[1] ?? '0';
  const idleCoins =
    embed.fields[3].value.match(/\*\*Idle coins\*\*: ([\d,]+)/)?.[1] ?? '0';
  const league = typedObjectEntries(LEAGUE_LABEL).find(([, value]) =>
    embed.title?.includes(value)
  )?.[0];

  return {
    energy: Number(energy),
    totalEnergy: Number(totalEnergy),
    packing: Number(packing),
    farms: Number(farms),
    workers: Number(workers),
    idlons: Number(idlons.replace(/,/g, '')),
    idlucks: Number(idlucks.replace(/,/g, '')),
    idleCoins: Number(idleCoins.replace(/,/g, '')),
    league
  };
};

const LEAGUE_LABEL = {
  [IDLE_FARM_LEAGUE.dirt1]: 'Dirt league I',
  [IDLE_FARM_LEAGUE.dirt2]: 'Dirt league II',
  [IDLE_FARM_LEAGUE.dirt3]: 'Dirt league III',
  [IDLE_FARM_LEAGUE.dirt4]: 'Dirt league IV',
  [IDLE_FARM_LEAGUE.dirt5]: 'Dirt league V',
  [IDLE_FARM_LEAGUE.cow1]: 'Cow league I',
  [IDLE_FARM_LEAGUE.cow2]: 'Cow league II',
  [IDLE_FARM_LEAGUE.cow3]: 'Cow league III',
  [IDLE_FARM_LEAGUE.cow4]: 'Cow league IV',
  [IDLE_FARM_LEAGUE.cow5]: 'Cow league V',
  [IDLE_FARM_LEAGUE.wheat1]: 'Wheat league I',
  [IDLE_FARM_LEAGUE.wheat2]: 'Wheat league II',
  [IDLE_FARM_LEAGUE.wheat3]: 'Wheat league III',
  [IDLE_FARM_LEAGUE.wheat4]: 'Wheat league IV',
  [IDLE_FARM_LEAGUE.wheat5]: 'Wheat league V',
  [IDLE_FARM_LEAGUE.glass1]: 'Glass league I',
  [IDLE_FARM_LEAGUE.glass2]: 'Glass league II',
  [IDLE_FARM_LEAGUE.glass3]: 'Glass league III',
  [IDLE_FARM_LEAGUE.glass4]: 'Glass league IV',
  [IDLE_FARM_LEAGUE.glass5]: 'Glass league V'
} as Record<keyof typeof IDLE_FARM_LEAGUE, string>;
