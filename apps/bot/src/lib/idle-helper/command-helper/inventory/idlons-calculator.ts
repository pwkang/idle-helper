import {Client, EmbedBuilder, Message, User} from 'discord.js';
import embedReaders from '../../../idle-farm/embed-readers';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_ITEMS} from '@idle-helper/constants';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';
import {djsMessageHelper} from '../../../discordjs/message';
import {infoService} from '../../../../services/database/info.service';
import {TMarketItems} from '@idle-helper/models/dist/info/info.type';
import {typedObjectEntries} from '@idle-helper/utils';

interface IIdlonsCalculator {
  message: Message;
  author: User;
  client: Client;
}

type IAllItems = Partial<Record<keyof typeof IDLE_FARM_ITEMS, number>>;

export const _idlonsCalculator = async ({message, client, author}: IIdlonsCalculator) => {
  let allItems: IAllItems = {};
  const inventory = embedReaders.inventory({
    embed: message.embeds[0],
  });
  const marketItems = await infoService.getMarketItems();
  allItems = {
    ...inventory,
  };
  const sentMessage = await djsMessageHelper.send({
    options: {
      embeds: [
        generateEmbed({
          items: allItems,
          marketItems,
          author,
        }),
      ],
    },
    client,
    channelId: message.channel.id,
  });
  const event = await createMessageEditedListener({
    messageId: message.id,
  });
  if (!event || !sentMessage) return;
  event.on('edited', (collected) => {
    const embed = collected.embeds[0];
    const updatedInventory = embedReaders.inventory({
      embed,
    });
    allItems = {
      ...allItems,
      ...updatedInventory,
    };
    const updatedEmbed = generateEmbed({
      items: allItems,
      marketItems,
      author,
    });
    djsMessageHelper.edit({
      options: {
        embeds: [updatedEmbed],
      },
      client,
      message: sentMessage,
    });
  });

};

interface IGenerateEmbed {
  items: IAllItems;
  marketItems: TMarketItems;
  author: User;
}

interface IItemInfo {
  emoji: string;
  name: string;
  totalPrice: number;
  isOverstocked: boolean;
  lastUpdatedAt: Date;
}

const generateEmbed = ({items, marketItems, author}: IGenerateEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: `${author.username} — idlons calculator`,
      iconURL: author.avatarURL() ?? undefined,
    });
  const itemsInfo: IItemInfo[] = [];
  typedObjectEntries(items).map(([key, value]) => {
    if (!marketItems[key]) return;
    itemsInfo.push({
      name: IDLE_FARM_ITEMS[key],
      emoji: BOT_EMOJI.items[key],
      totalPrice: (value ?? 0) * marketItems[key].price,
      isOverstocked: marketItems[key].isOverstocked,
      lastUpdatedAt: marketItems[key].lastUpdatedAt,
    });
  });
  itemsInfo.sort((a, b) => b.totalPrice - a.totalPrice);
  const totalValue = itemsInfo.reduce((acc, item) => acc + item.totalPrice, 0);
  for (let i = 0; i < itemsInfo.length; i += 15) {
    embed.addFields({
      name: '\u200b',
      value: itemsInfo.slice(i, i + 15).map(item => {
        return `${item.emoji} **${item.name}**: \`${item.totalPrice.toLocaleString()}${item.isOverstocked ? ' :warning:' : ''}\``;
      }).join('\n'),
      inline: true,
    });
  }
  const oldestUpdatedDate = itemsInfo.sort((a, b) => a.lastUpdatedAt.getTime() - b.lastUpdatedAt.getTime())[0].lastUpdatedAt;
  embed.setDescription(`Total value: **${totalValue.toLocaleString()}**`);
  embed.setFooter({
    text: 'Last updated: ',
  });
  embed.setTimestamp(oldestUpdatedDate);
  return embed;
};
