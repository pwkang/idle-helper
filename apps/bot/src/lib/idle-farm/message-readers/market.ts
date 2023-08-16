import {Embed} from 'discord.js';
import {IDLE_FARM_ITEMS} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface IMarketReader {
  embed: Embed;
}

interface IItem {
  type: keyof typeof IDLE_FARM_ITEMS;
  isOverstocked: boolean;
  price: number;
  priceRate: number;
}

export const _marketReader = ({embed}: IMarketReader) => {
  const items: IItem[] = [];
  const fields = embed.fields;
  for (const field of fields) {
    const name = typedObjectEntries(IDLE_FARM_ITEMS).find(([, value]) => field.name.match(new RegExp(`\\*\\*${value}\\*\\*`)))?.[0];
    const price = field.value.match(/\*\*Price\*\*: ([\d,]+) <:idlons:/)?.[1]?.replaceAll(',', '');
    const isOverstocked = field.name.includes('OVERSTOCKED');
    const priceRate = field.value.match(/`(.*)`/)?.[1]?.replaceAll('%', '');
    if (!name || !price) continue;
    items.push({
      type: name,
      priceRate: priceRate ? Number(priceRate) : 0,
      price: price ? Number(price) : 0,
      isOverstocked,
    });
  }
  return items;

};