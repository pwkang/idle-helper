import {EmbedBuilder, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {infoService} from '../../../../services/database/info.service';
import {
  BOT_COLOR,
  BOT_EMOJI,
  IDLE_FARM_DONOR_TIER,
  IDLE_FARM_ITEMS,
  IDLE_FARM_ITEMS_BOX_TYPE,
  IDLE_FARM_ITEMS_MATERIAL,
  PREFIX,
} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface IShowPackingProfits {
  author: User;
}

export const _showPackingProfits = async ({author}: IShowPackingProfits) => {
  const user = await userService.findUser({
    userId: author.id,
  });
  if (!user) return;
  const packingMultiplier = user.packing.multiplier;
  const marketItems = await infoService.getMarketItems();
  const profits = typedObjectEntries(IDLE_FARM_ITEMS_MATERIAL).map(([key]) => {
    const itemPrice = marketItems[key]?.price ?? 0;
    const taxValue = TAX_RATE[user.config.donorTier];
    const itemBoxName = IDLE_FARM_ITEMS_BOX_TYPE[key];
    const boxPrice = marketItems[itemBoxName]?.price ?? 0;
    return {
      name: key,
      profits: calculatePackingProfits({
        boxPrice,
        itemPrice,
        taxValue,
        multiplier: packingMultiplier,
      }),
      lastUpdated: marketItems[key]?.lastUpdatedAt,
    };
  });
  const lastUpdatedAt = profits.sort((a, b) => b.lastUpdated?.getTime() - a.lastUpdated?.getTime())[0].lastUpdated;
  const top10Profits = profits.sort((a, b) => b.profits - a.profits).slice(0, 10);
  const embed = generateEmbed({
    items: top10Profits,
    packingMultiplier,
    taxValue: TAX_RATE[user.config.donorTier],
    idlons: user.profile.idlons,
    lastUpdatedAt,
    workerTokens: user.items.workerTokens ?? 0,
  });

  return {
    embeds: [embed],
  };
};

interface IGenerateEmbed {
  items: {
    name: keyof typeof IDLE_FARM_ITEMS_MATERIAL;
    profits: number;
  }[];
  packingMultiplier: number;
  taxValue: ValuesOf<typeof TAX_RATE>;
  idlons: number;
  lastUpdatedAt?: Date;
  workerTokens: number;
}

const generateEmbed = ({items, packingMultiplier, taxValue, idlons, lastUpdatedAt, workerTokens}: IGenerateEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle('Packing Profits')
    .addFields({
      name: 'Idlons per token',
      value: items.map((item, index) => `\`[${index + 1}]\` ${BOT_EMOJI.items[item.name]} **${IDLE_FARM_ITEMS[item.name]}**: ${Math.round(item.profits).toLocaleString()} ${BOT_EMOJI.other.idlon}`).join('\n'),
    });

  embed.setDescription([
    `**Multiplier**: ${packingMultiplier}%`,
    `**Tax**: ${TAX_RATE_LABEL[taxValue]}`,
    `**Idlons**: ${idlons.toLocaleString()} ${BOT_EMOJI.other.idlon}`,
    `**Worker tokens**: ${workerTokens.toLocaleString()} ${BOT_EMOJI.items.workerTokens}`,
  ].join('\n'));

  embed.addFields({
    name: 'Commands',
    value: [
      `\`${PREFIX.bot}packing\` -> show packing profits`,
      `\`${PREFIX.bot}packing start [item name] [target idlons]\` -> Show guide to pack selected items until reach target idlons`,
    ].join('\n'),
  });

  embed.setTimestamp(lastUpdatedAt);
  embed.setFooter({
    text: 'Last updated',
  });

  return embed;
};

interface ICalculatePackingProfits {
  boxPrice: number;
  itemPrice: number;
  taxValue: ValuesOf<typeof TAX_RATE>;
  multiplier: number;
}

const calculatePackingProfits = ({
  boxPrice, multiplier, itemPrice, taxValue,
}: ICalculatePackingProfits) => {
  return ((boxPrice * (1 + multiplier / 100)) * taxValue) - (itemPrice * 100);
};

const TAX_RATE = {
  [IDLE_FARM_DONOR_TIER.nonDonor]: 0.9,
  [IDLE_FARM_DONOR_TIER.common]: 0.9,
  [IDLE_FARM_DONOR_TIER.talented]: 0.9,
  [IDLE_FARM_DONOR_TIER.wise]: 0.95,
} as const;

const TAX_RATE_LABEL = {
  [TAX_RATE.common]: '10%',
  [TAX_RATE.wise]: '5%',
} as const;