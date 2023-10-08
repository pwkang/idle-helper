import type { User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {infoService} from '../../../../services/database/info.service';
import {
  BOT_COLOR,
  BOT_EMOJI,
  IDLE_FARM_ITEMS,
  IDLE_FARM_ITEMS_BOX_TYPE,
  IDLE_FARM_ITEMS_MATERIAL,
  PREFIX,
  TAX_RATE_BOX,
  TAX_RATE_LABEL
} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';
import {calculatePackingProfits} from '../../../../utils/calc-packing-profits';
import embedProvider from '../../embeds';

interface IShowPackingProfits {
  author: User;
}

export const _showPackingProfits = async ({author}: IShowPackingProfits) => {
  const user = await userService.findUser({
    userId: author.id
  });
  if (!user) return;

  if (!user.config.donorTier) {
    return {
      embeds: [embedProvider.setDonor()]
    };
  }

  const packingMultiplier = user.packing.multiplier;
  const marketItems = await infoService.getMarketItems();
  const profits = typedObjectEntries(IDLE_FARM_ITEMS_MATERIAL).map(([key]) => {
    const itemPrice = marketItems[key]?.price ?? 0;
    const taxValue = TAX_RATE_BOX[user.config.donorTier];
    const itemBoxName = IDLE_FARM_ITEMS_BOX_TYPE[key];
    const boxPrice = marketItems[itemBoxName]?.price ?? 0;
    return {
      name: key,
      profits: calculatePackingProfits({
        boxPrice,
        itemPrice,
        taxValue,
        multiplier: packingMultiplier
      }),
      lastUpdated: marketItems[key]?.lastUpdatedAt
    };
  });
  const lastUpdatedAt = profits.sort(
    (a, b) => b.lastUpdated?.getTime() - a.lastUpdated?.getTime()
  )[0].lastUpdated;
  const top10Profits = profits
    .sort((a, b) => b.profits - a.profits)
    .slice(0, 10);
  const embed = generateEmbed({
    items: top10Profits,
    packingMultiplier,
    taxValue: TAX_RATE_BOX[user.config.donorTier],
    lastUpdatedAt
  });

  return {
    embeds: [embed]
  };
};

interface IGenerateEmbed {
  items: {
    name: keyof typeof IDLE_FARM_ITEMS_MATERIAL;
    profits: number;
  }[];
  packingMultiplier: number;
  taxValue: ValuesOf<typeof TAX_RATE_BOX>;
  lastUpdatedAt?: Date;
}

const generateEmbed = ({
  items,
  packingMultiplier,
  taxValue,
  lastUpdatedAt
}: IGenerateEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle('Packing Profits')
    .addFields({
      name: 'Idlons per token',
      value: items
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
      `\`${PREFIX.bot}packing\` -> show packing profits`,
      `\`${PREFIX.bot}packing start [target idlons] [item name]\` -> Show guide to pack selected item until target idlons reached`
    ].join('\n')
  });

  embed.setTimestamp(lastUpdatedAt);
  embed.setFooter({
    text: 'Last updated'
  });

  return embed;
};
