import {Message} from 'discord.js';
import {IDLE_FARM_ITEMS} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

export const _sellReader = (message: Message) => {
  const soldAmount = message.content.match(/<@\d+>, ([\d,]+) <:/)?.[1]?.replaceAll(',', '');
  const soldItem = typedObjectEntries(IDLE_FARM_ITEMS).find(([, value]) =>
    message.content.match(new RegExp(`\\*\\*${value}\\*\\*`)),
  )?.[0];
  const idlonsGained = message.content.match(/successfully sold for ([\d,]+) <:idlons/)?.[1]?.replaceAll(',', '');

  return {
    soldAmount: soldAmount ? Number(soldAmount) : 0,
    soldItem,
    idlonsGained: idlonsGained ? Number(idlonsGained) : 0,
  };
};