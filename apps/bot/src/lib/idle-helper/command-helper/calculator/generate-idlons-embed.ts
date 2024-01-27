import type {TMarketItems} from '@idle-helper/models/dist/info/info.type';
import type {BaseInteraction, User} from 'discord.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import type {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_DONOR_TIER, IDLE_FARM_ITEMS, TAX_RATE_COMMON} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

export type IAllItems = Partial<Record<keyof typeof IDLE_FARM_ITEMS, number>>;

interface IGenerateEmbed {
  marketItems: TMarketItems;
  author: User;
  user: IUser;
  title?: string;
  type?: 'idlons' | 'rate';
}

interface IItemInfo {
  emoji: string;
  name: string;
  totalPrice: number;
  isOverstocked: boolean;
  isOutOfStock: boolean;
  lastUpdatedAt: Date;
  rate: number;
}

export const generateIdlonsEmbed = ({
  marketItems,
  author,
  user,
  title,
  type = 'idlons'
}: IGenerateEmbed) => {

  const getMessageOptions = (items: IAllItems) => {
    const embed = getEmbed({
      items,
      marketItems,
      author,
      user,
      title,
      type
    });

    const row = getComponents(type);

    return {
      embeds: [embed],
      components: [row]
    };
  };

  const replyInteraction = (interaction: BaseInteraction, items: IAllItems) => {
    if (!interaction.isButton()) return null;
    switch (interaction.customId) {
      case 'idlons':
        type = 'idlons';
        break;
      case 'rate':
        type = 'rate';
        break;
    }
    const embed = getEmbed({
      items,
      marketItems,
      author,
      user,
      title,
      type
    });
    const row = getComponents(type);

    return {
      embeds: [embed],
      components: [row]
    };
  };

  return {
    getMessageOptions,
    replyInteraction
  };
};

const getEmbed = ({
  items,
  marketItems,
  author,
  user,
  title,
  type
}: {
  items: IAllItems;
  marketItems: TMarketItems;
  author: User;
  user: IUser;
  title?: string;
  type: 'idlons' | 'rate';
}) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username} — ${title}`,
    iconURL: author.avatarURL() ?? undefined
  });

  const itemsInfo: IItemInfo[] = [];
  const taxRate = TAX_RATE_COMMON[user.config.donorTier];
  typedObjectEntries(items).forEach(([key, value]) => {
    if (!marketItems[key]) return;
    let totalPrice = (value ?? 0) * marketItems[key].price;
    if (totalPrice > 0) totalPrice *= taxRate;
    totalPrice = Math.round(totalPrice);
    itemsInfo.push({
      name: IDLE_FARM_ITEMS[key],
      emoji: BOT_EMOJI.items[key],
      totalPrice,
      isOverstocked: marketItems[key].isOverstocked,
      isOutOfStock: marketItems[key].isOutOfStock,
      lastUpdatedAt: marketItems[key].lastUpdatedAt,
      rate: marketItems[key].rate
    });
  });
  itemsInfo.sort((a, b) => b.totalPrice - a.totalPrice);
  const sellable = Math.round(
    itemsInfo
      .filter((item) => item.totalPrice > 0 && !item.isOverstocked)
      .reduce((acc, item) => acc + item.totalPrice, 0)
  );
  const overstocked = Math.round(
    itemsInfo
      .filter((item) => item.totalPrice > 0 && item.isOverstocked)
      .reduce((acc, item) => acc + item.totalPrice, 0)
  );
  const debt = Math.round(
    itemsInfo
      .filter((item) => item.totalPrice < 0 && !item.isOutOfStock)
      .reduce((acc, item) => acc + item.totalPrice, 0)
  );
  for (let i = 0; i < itemsInfo.length; i += 15) {
    embed.addFields({
      name: '\u200b',
      value: itemsInfo
        .slice(i, i + 15)
        .map((item) => {
          const warning = item.isOverstocked || item.isOutOfStock ? ' :warning:' : '';
          const price = item.totalPrice.toLocaleString();
          let data;
          switch (type) {
            case 'idlons':
              data = `\`${price}\``;
              break;
            case 'rate':
              data = `\`${Math.round(item.rate)}%\``;
              break;
          }

          return `${item.emoji} **${item.name}**: ${data}${warning}`;
        })
        .join('\n'),
      inline: true
    });
  }
  const oldestUpdatedDate = itemsInfo.sort(
    (a, b) => a.lastUpdatedAt.getTime() - b.lastUpdatedAt.getTime()
  )[0]?.lastUpdatedAt;
  embed.setDescription(
    [
      `Sellable: **${sellable.toLocaleString()}** ${BOT_EMOJI.other.idlon}`,
      `Overstocked: **${overstocked.toLocaleString()}** ${BOT_EMOJI.other.idlon}`,
      `Debts: **${debt.toLocaleString()}** ${BOT_EMOJI.other.idlon}`
    ].join('\n')
  );
  embed.setFooter({
    text: `Tax: ${TAX_RATE_LABEL[user.config.donorTier]} | Last updated${
      oldestUpdatedDate ? '' : ': N/A'
    }`
  });
  if (oldestUpdatedDate) embed.setTimestamp(oldestUpdatedDate);


  return embed;
};

const getComponents = (type: 'idlons' | 'rate') => {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('idlons')
        .setLabel('Idlons')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(type === 'idlons')
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('rate')
        .setLabel('Rate')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(type === 'rate')
    );
};

const TAX_RATE_LABEL = {
  [IDLE_FARM_DONOR_TIER.nonDonor]: '20%',
  [IDLE_FARM_DONOR_TIER.common]: '20%',
  [IDLE_FARM_DONOR_TIER.talented]: '20%',
  [IDLE_FARM_DONOR_TIER.wise]: '10%'
} as const;
