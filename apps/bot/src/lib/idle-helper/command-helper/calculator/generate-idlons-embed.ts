import {TMarketItems} from '@idle-helper/models/dist/info/info.type';
import {EmbedBuilder, User} from 'discord.js';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_DONOR_TIER, IDLE_FARM_ITEMS} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

export type IAllItems = Partial<Record<keyof typeof IDLE_FARM_ITEMS, number>>;

interface IGenerateEmbed {
  items: IAllItems;
  marketItems: TMarketItems;
  author: User;
  user: IUser;
  title?: string;
}

interface IItemInfo {
  emoji: string;
  name: string;
  totalPrice: number;
  isOverstocked: boolean;
  lastUpdatedAt: Date;
}

export const generateEmbed = ({items, marketItems, author, user, title}: IGenerateEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username} — ${title}`,
    iconURL: author.avatarURL() ?? undefined,
  });
  const itemsInfo: IItemInfo[] = [];
  const taxRate = TAX_RATE[user.config.donorTier];
  typedObjectEntries(items).map(([key, value]) => {
    if (!marketItems[key]) return;
    itemsInfo.push({
      name: IDLE_FARM_ITEMS[key],
      emoji: BOT_EMOJI.items[key],
      totalPrice: Math.round((value ?? 0) * marketItems[key].price * taxRate),
      isOverstocked: marketItems[key].isOverstocked,
      lastUpdatedAt: marketItems[key].lastUpdatedAt,
    });
  });
  itemsInfo.sort((a, b) => b.totalPrice - a.totalPrice);
  const totalValue = Math.round(itemsInfo.reduce((acc, item) => acc + item.totalPrice, 0));
  for (let i = 0; i < itemsInfo.length; i += 15) {
    embed.addFields({
      name: '\u200b',
      value: itemsInfo
        .slice(i, i + 15)
        .map((item) => {
          return `${item.emoji} **${item.name}**: \`${item.totalPrice.toLocaleString()}\`${
            item.isOverstocked ? ' :warning:' : ''
          }`;
        })
        .join('\n'),
      inline: true,
    });
  }
  const oldestUpdatedDate = itemsInfo.sort(
    (a, b) => a.lastUpdatedAt.getTime() - b.lastUpdatedAt.getTime()
  )[0]?.lastUpdatedAt;
  embed.setDescription(`Total value: **${totalValue.toLocaleString()}** ${BOT_EMOJI.other.idlon} `);
  embed.setFooter({
    text: `Tax: ${TAX_RATE_LABEL[user.config.donorTier]} | Last updated${
      oldestUpdatedDate ? '' : ': N/A'
    }`,
  });
  if (oldestUpdatedDate) embed.setTimestamp(oldestUpdatedDate);
  return embed;
};

const TAX_RATE = {
  [IDLE_FARM_DONOR_TIER.nonDonor]: 0.8,
  [IDLE_FARM_DONOR_TIER.common]: 0.8,
  [IDLE_FARM_DONOR_TIER.talented]: 0.8,
  [IDLE_FARM_DONOR_TIER.wise]: 0.9,
} as const;

const TAX_RATE_LABEL = {
  [IDLE_FARM_DONOR_TIER.nonDonor]: '20%',
  [IDLE_FARM_DONOR_TIER.common]: '20%',
  [IDLE_FARM_DONOR_TIER.talented]: '20%',
  [IDLE_FARM_DONOR_TIER.wise]: '10%',
} as const;
