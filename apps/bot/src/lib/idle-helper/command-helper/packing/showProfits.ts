import type {User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {infoService} from '../../../../services/database/info.service';
import type {IDLE_FARM_ITEMS_PACKING_MATERIAL} from '@idle-helper/constants';
import {
  BOT_COLOR,
  BOT_EMOJI,
  IDLE_FARM_ITEMS,
  IDLE_FARM_ITEMS_MATERIAL,
  IDLE_FARM_ITEMS_PACKING_PAIR,
  IDLE_FARM_ITEMS_REFINED,
  PREFIX,
  TAX_RATE_BOX,
  TAX_RATE_LABEL
} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';
import {calculatePackingProfits} from '../../../../utils/calc-packing-profits';
import embedProvider from '../../embeds';

interface IShowPackingProfits {
  author: User;
  multiplier?: number;
  taxValue?: ValuesOf<typeof TAX_RATE_BOX>;
}

export const _showPackingProfits = async ({author, multiplier, taxValue}: IShowPackingProfits) => {
  const user = await userService.findUser({
    userId: author.id
  });
  if (!user) return;

  if (!user.config.donorTier) {
    return {
      embeds: [embedProvider.setDonor()]
    };
  }


  const packingMultiplier = multiplier ?? user.packing.multiplier;
  const marketItems = await infoService.getMarketItems();
  const taxValueToUse = taxValue ?? TAX_RATE_BOX[user.config.donorTier];

  const _generateProfits = (items: Partial<typeof IDLE_FARM_ITEMS_MATERIAL & typeof IDLE_FARM_ITEMS_REFINED>) => generateProfits({
    items,
    taxValue: taxValueToUse,
    marketItems,
    multiplier: packingMultiplier
  });

  const materialProfits = _generateProfits(IDLE_FARM_ITEMS_MATERIAL);
  const refinedProfits = _generateProfits(IDLE_FARM_ITEMS_REFINED);
  const profits = [...materialProfits, ...refinedProfits];

  const lastUpdatedAt = profits.sort(
    (a, b) => b.lastUpdated?.getTime() - a.lastUpdated?.getTime()
  )[0].lastUpdated;
  const top3MaterialProfits = materialProfits
    .sort((a, b) => b.profits - a.profits)
    .slice(0, 3);
  const top3RefinedProfits = refinedProfits
    .sort((a, b) => b.profits - a.profits)
    .slice(0, 3);
  const embed = generateEmbed({
    packingMultiplier,
    taxValue: taxValueToUse,
    lastUpdatedAt,
    refined: top3RefinedProfits,
    materials: top3MaterialProfits
  });

  return {
    embeds: [embed]
  };
};

interface IGenerateProfits {
  items: Partial<typeof IDLE_FARM_ITEMS_MATERIAL & typeof IDLE_FARM_ITEMS_REFINED>;
  taxValue: ValuesOf<typeof TAX_RATE_BOX>;
  marketItems: Awaited<ReturnType<typeof infoService.getMarketItems>>;
  multiplier: number;
}

const generateProfits = ({items, taxValue, marketItems, multiplier}: IGenerateProfits) => {
  return typedObjectEntries(items).map(([key]) => {
    const itemPrice = marketItems[key]?.price ?? 0;
    const itemBoxName = IDLE_FARM_ITEMS_PACKING_PAIR[key];
    const boxPrice = marketItems[itemBoxName]?.price ?? 0;
    return {
      name: key,
      profits: calculatePackingProfits({
        boxPrice,
        itemPrice,
        taxValue,
        multiplier
      }),
      lastUpdated: marketItems[key]?.lastUpdatedAt
    };
  });
};

type TProfits = {
  name: keyof typeof IDLE_FARM_ITEMS_PACKING_MATERIAL;
  profits: number;
}

interface IGenerateEmbed {
  materials: TProfits[];
  refined: TProfits[];
  packingMultiplier: number;
  taxValue: ValuesOf<typeof TAX_RATE_BOX>;
  lastUpdatedAt?: Date;
}

const generateEmbed = ({
  materials,
  refined,
  packingMultiplier,
  taxValue,
  lastUpdatedAt
}: IGenerateEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle('Packing Profits')
  ;

  const rows = [
    {label: 'Materials', items: materials},
    {label: 'Refined', items: refined}
  ];

  for (const row of rows) {
    embed.addFields({
      name: row.label,
      value: row.items
        .map(
          (item, index) =>
            `\`[${index + 1}]\` ${BOT_EMOJI.items[item.name]} **${
              IDLE_FARM_ITEMS[item.name]
            }**: ${Math.round(item.profits).toLocaleString()} ${
              BOT_EMOJI.other.idlon
            }`
        )
        .join('\n')
    });
  }

  const description = [
    `Multiplier: **x${packingMultiplier.toLocaleString()}**`,
    `Tax: **${TAX_RATE_LABEL[taxValue]}**`
  ];

  if (packingMultiplier === 1) {
    description.push('');
    description.push(
      `⚠️ Multiplier is not registered. The materials below might not be the best items to pack. Please pack any items \`${PREFIX.idleFarm}packing [any item] 100\` and run this command again`
    );
  }

  embed.setDescription(description.join('\n'));

  embed.addFields({
    name: 'Commands',
    value: [
      `- \`${PREFIX.bot}packing <args> ...\` -> show packing profits`,
      ' - `-m [multiplier]` -> custom multiplier',
      ' - `-f2p` -> 10% tax',
      ' - `-p2w` -> 5% tax',
      `- \`${PREFIX.bot}packing start [target idlons] [item name]\` -> Show guide to pack selected item until target idlons reached`
    ].join('\n')
  });

  embed.setTimestamp(lastUpdatedAt);
  embed.setFooter({
    text: 'Last updated'
  });

  return embed;
};
