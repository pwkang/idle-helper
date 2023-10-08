import type {Message} from 'discord.js';
import {typedObjectEntries} from '@idle-helper/utils';
import {
  IDLE_FARM_ITEMS_BOX,
  IDLE_FARM_ITEMS_MATERIAL
} from '@idle-helper/constants';

export const _packingReader = (message: Message) => {
  const materialType = typedObjectEntries(IDLE_FARM_ITEMS_MATERIAL).find(
    ([, value]) => message.content.match(new RegExp(`\\*\\*${value}\\*\\*`))
  )?.[0];
  const material = message.content
    .match(/<@\d+>, ([\d,]+) <:/)?.[1]
    ?.replaceAll(',', '');
  const materialAmount = material ? Number(material) : 0;
  const boxType = typedObjectEntries(IDLE_FARM_ITEMS_BOX).find(([, value]) =>
    message.content.match(new RegExp(`\\*\\*${value}\\*\\*`))
  )?.[0];
  const box = message.content
    .match(/converted into ([\d,]+) <:/)?.[1]
    ?.replaceAll(',', '');
  const boxAmount = box ? Number(box) : 0;

  const multiplier = (boxAmount / materialAmount) * 100;

  return {
    materialType,
    materialAmount: materialAmount,
    boxType,
    boxGained: boxAmount,
    multiplier
  };
};
