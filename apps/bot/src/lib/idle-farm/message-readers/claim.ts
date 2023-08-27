import {Embed} from 'discord.js';
import {IDLE_FARM_ITEMS} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface IClaimReader {
  embed: Embed;
}

type TInventoryItems = Partial<Record<keyof typeof IDLE_FARM_ITEMS, number>>;

export const _claimReader = ({embed}: IClaimReader) => {
  const items: TInventoryItems = {};
  if (embed.fields[0].value) {
    const itemsRow = embed.fields[0].value.split('\n');
    for (const itemRow of itemsRow) {
      const type = typedObjectEntries(IDLE_FARM_ITEMS).find(([, name]) =>
        itemRow.match(new RegExp(`\\*\\*${name}\\*\\*`))
      )?.[0] as keyof typeof IDLE_FARM_ITEMS;
      const amount = itemRow
        .match(/^\+([\d,]+) <:/)?.[1]
        ?.replaceAll(',', '')
        ?.trim();
      if (!type) continue;
      items[type] = amount ? parseInt(amount) : 0;
    }
  }
  return items;
};
