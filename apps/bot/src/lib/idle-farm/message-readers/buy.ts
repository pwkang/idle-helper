import {Message} from 'discord.js';
import {IDLE_FARM_ITEMS} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

export const _buyReader = (message: Message) => {
  const boughtAmount = message.content.match(/<@\d+>, ([\d,]+) <:/)?.[1]?.replaceAll(',', '');
  const boughtItem = typedObjectEntries(IDLE_FARM_ITEMS).find(([, value]) =>
    message.content.match(new RegExp(`\\*\\*${value}\\*\\*`)),
  )?.[0];
  const idlonsSpent = message.content.match(/successfully bought for ([\d,]+) <:idlons/)?.[1]?.replaceAll(',', '');

  return {
    boughtAmount: boughtAmount ? Number(boughtAmount) : 0,
    boughtItem,
    idlonsSpent: idlonsSpent ? Number(idlonsSpent) : 0,
  };
};