import {
  ActionRowBuilder,
  BaseInteraction,
  BaseMessageOptions,
  Guild,
  InteractionReplyOptions,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import {generateNavigationRow, NAVIGATION_ROW_BUTTONS} from '../../../../utils/pagination-row';
import {_getGuildSettingsEmbed} from './embed/guild-settings.embed';
import messageFormatter from '../../../discordjs/message-formatter';
import {getGuildToggleEmbed} from '../toggle/type/guild.toggle';
import {IGuild} from '@idle-helper/models';
import {guildService} from '../../../../services/database/guild.service';

export const ITEMS_PER_PAGE = 20;

export const GUILD_SELECTOR_NAME = 'guild-selector';

export const GUILD_SETTINGS_PAGE_TYPE = {
  settings: 'settings',
  toggle: 'toggle',
} as const;

interface IShowSettings {
  server: Guild;
  initialGuildRoleId?: string;
  type: ValuesOf<typeof GUILD_SETTINGS_PAGE_TYPE>;
}

export const _showSettings = async ({server, type, initialGuildRoleId}: IShowSettings) => {
  const guilds = await guildService.getAllGuilds({
    serverId: server.id,
  });
  let currentGuildRoleId = initialGuildRoleId ?? guilds[0]?.roleId;
  let page = 0;

  function getMessagePayload(): InteractionReplyOptions {
    if (!guilds.length)
      return {
        content: 'There is no guild setup in this server',
      };
    if (!guilds.find((guild) => guild.roleId === currentGuildRoleId)) {
      return {
        content: `There is no guild with role ${messageFormatter.role(
          currentGuildRoleId,
        )} setup in this server`,
        ephemeral: true,
      };
    }

    return {
      embeds: [getEmbed()],
      components: getComponents(),
    };
  }

  function getEmbed() {
    switch (type) {
      case GUILD_SETTINGS_PAGE_TYPE.settings:
        return _getGuildSettingsEmbed({
          guildAccount: guilds.find((guild) => guild.roleId === currentGuildRoleId)!,
        });
      case GUILD_SETTINGS_PAGE_TYPE.toggle:
        return getGuildToggleEmbed({
          guildAccount: guilds.find((guild) => guild.roleId === currentGuildRoleId)!,
        });
    }
  }

  function getComponents() {
    const components: BaseMessageOptions['components'] = [];

    const guildSelector = _getPageSelector({
      guilds,
      page,
      server,
      selectedGuildRoleId: currentGuildRoleId,
      limit: ITEMS_PER_PAGE,
    });

    const paginator = generateNavigationRow({
      page,
      itemsPerPage: ITEMS_PER_PAGE,
      total: Math.ceil(guilds.length / ITEMS_PER_PAGE) - 1,
    });

    if (guilds.length > 1) components.push(guildSelector);

    if (guilds.length > ITEMS_PER_PAGE) components.push(paginator);

    return components;
  }

  function replyInteraction({interaction, customId}: IReplyInteraction): BaseMessageOptions {
    if (interaction.isStringSelectMenu() && customId === GUILD_SELECTOR_NAME) {
      currentGuildRoleId = interaction.values[0];
    }
    if (interaction.isButton()) {
      switch (customId) {
        case NAVIGATION_ROW_BUTTONS.first:
          page = 0;
          break;
        case NAVIGATION_ROW_BUTTONS.prev:
          page--;
          break;
        case NAVIGATION_ROW_BUTTONS.next:
          page++;
          break;
        case NAVIGATION_ROW_BUTTONS.last:
          page = Math.ceil(guilds.length / ITEMS_PER_PAGE) - 1;
          break;
      }
    }
    return {
      embeds: [getEmbed()],
      components: getComponents(),
    };
  }

  return {
    getMessagePayload,
    replyInteraction,
  };
};

interface IReplyInteraction {
  interaction: BaseInteraction | StringSelectMenuInteraction;
  customId: string;
}

interface IGetPageSelector {
  server: Guild;
  guilds: IGuild[];
  page: number;
  limit: number;
  selectedGuildRoleId?: string;
}

const _getPageSelector = ({page, guilds, limit, selectedGuildRoleId, server}: IGetPageSelector) => {
  const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>();
  const menu = new StringSelectMenuBuilder()
    .setCustomId(GUILD_SELECTOR_NAME)
    .setPlaceholder('Select a guild');
  const start = page * limit;
  const end = start + limit;
  const guildsOnPage = guilds.slice(start, end);
  guildsOnPage.forEach((guild) => {
    const roleName = server.roles.cache.get(guild.roleId)?.name;
    menu.addOptions({
      label: guild.info.name ? guild.info.name : `Role: ${roleName ?? 'Not found'}`,
      description: guild.info.name ? `Role: ${roleName ?? 'Not found'}` : undefined,
      value: guild.roleId,
      default: guild.roleId === selectedGuildRoleId,
    });
  });
  actionRow.addComponents(menu);
  return actionRow;
};
