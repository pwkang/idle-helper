import {infoService} from '../../../../services/database/info.service';
import type {TMarketItems} from '@idle-helper/models/dist/info/info.type';
import type {BaseInteraction} from 'discord.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import {IDLE_FARM_ITEMS, IDLE_FARM_ITEMS_BOX, IDLE_FARM_ITEMS_CONTAINER} from '@idle-helper/constants';
import {
  BOT_COLOR,
  BOT_EMOJI,
  IDLE_FARM_ITEMS_ASSEMBLY,
  IDLE_FARM_ITEMS_MATERIAL,
  IDLE_FARM_ITEMS_PRODUCT,
  IDLE_FARM_ITEMS_REFINED
} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

type EmbedType = 'price' | 'rate' | 'overstocked' | 'outOfStock';

const defaultType: EmbedType = 'price';

export const _marketHelper = async () => {
  const marketItems = await infoService.getMarketItems();

  const render = () => {
    return {
      embeds: [getEmbed(marketItems, defaultType)],
      components: [getButtonsRow(defaultType)]
    };
  };

  const replyInteraction = async (interaction: BaseInteraction) => {
    if (!interaction.isButton()) return null;

    const type = interaction.customId as EmbedType;
    return {
      embeds: [getEmbed(marketItems, type)],
      components: [getButtonsRow(type)]
    };
  };

  return {
    render,
    replyInteraction
  };
};

type TCategory = {
  items: Partial<typeof IDLE_FARM_ITEMS>;
  label: string;
}

const categories: TCategory[] = [

  {
    items: IDLE_FARM_ITEMS_MATERIAL,
    label: 'Materials'
  },

  {
    items: IDLE_FARM_ITEMS_REFINED,
    label: 'Refined'
  },
  {
    items: IDLE_FARM_ITEMS_PRODUCT,
    label: 'Products'
  },
  {
    items: IDLE_FARM_ITEMS_ASSEMBLY,
    label: 'Assemblies'
  }
];

const ITEMS_PER_FIELD = 15;

const getEmbed = (marketItems: TMarketItems, type: EmbedType) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: 'Market items'
    });

  if(type === 'rate') {
    const sorted = typedObjectEntries(marketItems)
      .filter(([key]) => !(key in IDLE_FARM_ITEMS_BOX) && !(key in IDLE_FARM_ITEMS_CONTAINER))
      .sort(([, a], [, b]) => b.rate - a.rate);
    const value: string[] = [];
    sorted.forEach(([key, item], index, array) => {
      const toShow = index === 0 || array[index - 1][1].rate !== item.rate;
      const icon = BOT_EMOJI.items[key];
      const rateStr = item.rate > 0 ? `+${item.rate}%` : `${item.rate}%`;
      const rate = toShow ? `: \`${rateStr}\`` : '';
      value.push(`${icon} **${IDLE_FARM_ITEMS[key]}**${rate}`);
    });

    for (let i = 0; i < value.length; i += ITEMS_PER_FIELD) {
      embed.addFields({
        name: '\u200b',
        value: value.slice(i, i + ITEMS_PER_FIELD).join('\n'),
        inline: true
      });
    }

  }else{
    let hasItems = false;
    categories.forEach(({items, label}) => {
      const value: string[] = [];

      typedObjectEntries(items).forEach(([key, label]) => {
        const item = marketItems[key];
        if (!item) return;
        const icon = BOT_EMOJI.items[key];
        const price = item.price.toLocaleString();

        switch (type) {
          case 'price':
            value.push(`${icon} **${label}**: \`${price}\``);
            break;
          case 'overstocked':
            if (item.isOverstocked) value.push(`${icon} **${label}**`);
            break;
          case 'outOfStock':
            if (item.isOutOfStock) value.push(`${icon} **${label}**`);
            break;
        }
      });

      for (let i = 0; i < value.length; i += ITEMS_PER_FIELD) {
        embed.addFields({
          name: i === 0 ? label : '\u200b',
          value: value.slice(i, i + ITEMS_PER_FIELD).join('\n'),
          inline: true
        });
      }
      if(value.length) hasItems = true;
    });
    if(!hasItems) embed.setDescription('No items');

  }


  const oldestUpdatedDate = Object.values(marketItems).sort(
    (a, b) => a.lastUpdatedAt.getTime() - b.lastUpdatedAt.getTime()
  )[0]?.lastUpdatedAt;


  embed.setFooter({
    text: `Last updated${oldestUpdatedDate ? '' : ': N/A'}`
  });
  if (oldestUpdatedDate) embed.setTimestamp(oldestUpdatedDate);

  return embed;
};

const getButtonsRow = (type: EmbedType) => {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('price')
        .setDisabled(type === 'price')
        .setLabel('Price')
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('rate')
        .setDisabled(type === 'rate')
        .setLabel('Rate')
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('overstocked')
        .setDisabled(type === 'overstocked')
        .setLabel('Overstocked')
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('outOfStock')
        .setDisabled(type === 'outOfStock')
        .setLabel('Out of stock')
        .setStyle(ButtonStyle.Primary)
    );
};
