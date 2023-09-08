import {
  ActionRowBuilder,
  BaseInteraction,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import {BOT_COLOR, BOT_INVITE_LINK, SUPPORT_SERVER_INVITE_LINK} from '@idle-helper/constants';
import {helpConfig} from './help.config';
import messageFormatter from '../../../discordjs/message-formatter';
import {generateNavigationRow} from '../../../../utils/pagination-row';

interface IHelp {
  client: Client;
  channelId: string;
  serverId: string;
}

export const _help = ({client, channelId, serverId}: IHelp) => {
  let page = 0;
  let categoryId: string | undefined;
  let selectMenuId: string | undefined;

  function render(): BaseMessageOptions {
    const embed = getEmbed({
      client, page, categoryId, selectMenuId, channelId, serverId,
    });
    const components = getComponents({page, categoryId, selectMenuId});
    return {
      embeds: [embed],
      components,
    };
  }

  function replyInteraction(interaction: BaseInteraction): BaseMessageOptions {
    if (interaction.isButton() && new RegExp('^category:').test(interaction.customId)) {
      categoryId = interaction.customId.replace('category:', '');
      selectMenuId = undefined;
      page = 0;
    }
    if (interaction.isButton() && !isNaN(Number(interaction.customId))) {
      page = Number(interaction.customId);
    }
    if (interaction.isStringSelectMenu()) {
      selectMenuId = interaction.values[0];
      page = 0;
    }
    return render();
  }

  return {
    render,
    replyInteraction,
  };
};

interface IGetEmbed {
  client: Client;
  page: number;
  categoryId?: string;
  selectMenuId?: string;
  serverId: string;
  channelId: string;
}

const LINES_PER_PAGE = 8;

const getEmbed = ({client, categoryId, page, selectMenuId, channelId, serverId}: IGetEmbed) => {
  const embed = new EmbedBuilder()
    .setTitle('IDLE Helper')
    .setColor(BOT_COLOR.embed)
    .setThumbnail(client.user?.displayAvatarURL() ?? null);

  const category = helpConfig.find(v => v.id === categoryId) ?? helpConfig[0];
  const selectedMenuItem = category.selectMenu.items?.find(v => v.id === selectMenuId);
  embed.setTitle(category.home.title);
  embed.setDescription(category.home.description.join('\n'));

  if (selectedMenuItem && selectedMenuItem.commands) {
    const range = {
      start: page * LINES_PER_PAGE,
      end: (page + 1) * LINES_PER_PAGE,
    };
    let currentLines = 0;
    let description = '';
    for (let i = 0; i < selectedMenuItem.commands.length; i++) {
      const command = selectedMenuItem.commands[i];
      if (currentLines >= range.start && currentLines < range.end) {
        description += [command.name.map(name => convertCommandName({
          name,
          channelId,
          serverId,
        })).join(' | '),
        command.description.map(d => `- ${d}`).join('\n'),
        '',
        '',
        ].join('\n');
      }
      currentLines += command.description.length;
    }
    if (description) {
      embed.setDescription(description);
    }

  } else if (selectedMenuItem && selectedMenuItem.info) {
    const info = selectedMenuItem.info[page];
    embed.setTitle(info.title);
    embed.setDescription(info.description.join('\n'));
    if (info.image) embed.setImage(info.image);
  } else {
    if (category.home.fields)
      embed.addFields(...category.home.fields.map(v => ({
        name: v.name,
        value: v.value.join('\n'),
        inline: v.inline,
      })));
  }


  return embed;
};

interface IGetComponents {
  page: number;
  categoryId?: string;
  selectMenuId?: string;
}

const getComponents = ({
  selectMenuId, categoryId, page,
}: IGetComponents) => {
  const rows = [];
  const category = helpConfig.find(v => v.id === categoryId) ?? helpConfig[0];
  const selectMenu = category?.selectMenu.items.find(v => v.id === selectMenuId);

  if (category && selectMenu) {
    if (selectMenu.commands) {
      const totalLines = selectMenu.commands.reduce((acc, cur) => acc + cur.description.length, 0);
      const totalPages = Math.ceil(totalLines / LINES_PER_PAGE);
      if (totalPages > 1) {
        rows.push(
          generateNavigationRow({
            itemsPerPage: LINES_PER_PAGE,
            page,
            total: totalLines,
          }),
        );
      }
    } else if (selectMenu.info) {
      const totalPages = selectMenu.info.length;
      if (totalPages > 1) {
        rows.push(
          generateNavigationRow({
            itemsPerPage: 1,
            page,
            total: totalPages,
          }),
        );
      }
    }
  }

  const categoryRow = new ActionRowBuilder<ButtonBuilder>();

  for (const category of helpConfig) {
    categoryRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`category:${category.id}`)
        .setLabel(category.label)
        .setStyle(ButtonStyle.Primary),
    );
  }
  rows.push(categoryRow);

  const selectMenuRow = new ActionRowBuilder<StringSelectMenuBuilder>();
  if (category.selectMenu?.items?.length) {
    selectMenuRow.addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('selectMenu')
        .setPlaceholder(category.selectMenu.name)
        .setOptions(category.selectMenu.items.map(v => ({
          value: v.id,
          label: v.label,
          description: v.description,
          emoji: v.emoji,
          default: v.id === selectMenuId,
        }))),
    );
  }
  rows.push(selectMenuRow);


  const linksRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setLabel('Invite')
        .setStyle(ButtonStyle.Link)
        .setURL(BOT_INVITE_LINK),
    )
    .addComponents(
      new ButtonBuilder()
        .setLabel('Support')
        .setStyle(ButtonStyle.Link)
        .setURL(SUPPORT_SERVER_INVITE_LINK),
    );
  rows.push(linksRow);

  return rows;
};

interface IConvertName {
  name: string;
  channelId: string;
  serverId: string;
}

const convertCommandName = ({name, channelId, serverId}: IConvertName) => {
  if (new RegExp('^</.*:\\d+>$').test(name)) {
    return name;
  } else {
    return messageFormatter.hyperlink({
      url: messageFormatter.channelUrl({
        serverId,
        channelId,
      }),
      text: name,
    });
  }
};
