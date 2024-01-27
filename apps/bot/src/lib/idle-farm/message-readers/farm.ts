import type {Embed} from 'discord.js';
import {IDLE_FARM_FARM_TYPE, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface IFarmReader {
  embed: Embed;
}

interface IFarmInfo {
  worker?: keyof typeof IDLE_FARM_WORKER_TYPE;
  farm?: keyof typeof IDLE_FARM_FARM_TYPE;
  id?: string;
  itemsPerHour: number;
  level: number;
}

export const _farmReader = ({embed}: IFarmReader) => {
  const [, currentPage, maxPage] = embed.footer?.text.match(/Page (\d+)\/(\d+)/) ?? [];
  const farms: IFarmInfo[] = [];
  for (const field of embed.fields) {
    const worker = typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(([, value]) => field.value.includes(value))?.[0];
    const farm = typedObjectEntries(IDLE_FARM_FARM_TYPE).find(([, value]) => field.name.includes(`> ${value} Lv`))?.[0];
    const id = field.name.match(/\[ID: ([a-zA-Z0-9]+)]/)?.[1];
    const itemsPerHour = field.value.match(/\*\*Items per hour\*\*: ([\d,]+)/)?.[1]?.replaceAll(',', '');
    const level = field.name.match(/Lv(\d+)/)?.[1];
    farms.push({
      worker,
      farm,
      id,
      itemsPerHour: itemsPerHour ? Number(itemsPerHour) : 0,
      level: level ? Number(level) : 0
    });
  }
  return {
    currentPage: Number(currentPage),
    maxPage: Number(maxPage),
    farms
  };
};
