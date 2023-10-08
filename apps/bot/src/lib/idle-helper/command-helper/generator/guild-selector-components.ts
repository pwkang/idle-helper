import type {
  BaseInteraction,
  BaseMessageOptions,
  Guild,
  StringSelectMenuInteraction} from 'discord.js';
import {
  ActionRowBuilder,
  StringSelectMenuBuilder
} from 'discord.js';
import type {IGuild} from '@idle-helper/models';
import {generateNavigationRow} from '../../../../utils/pagination-row';

const ITEMS_PER_PAGE = 20;

const GUILD_SELECTOR_NAME = 'guild-selector';

interface IGuildSelectorComponents {
  guilds: IGuild[];
  page: number;
  server: Guild;
  currentGuildRoleId?: string;
}

export const guildSelectorComponents = ({
  guilds,
  currentGuildRoleId,
  server,
  page
}: IGuildSelectorComponents) => {
  const components: BaseMessageOptions['components'] = [];

  const guildSelector = _getPageSelector({
    guilds,
    page,
    server,
    selectedGuildRoleId: currentGuildRoleId,
    limit: ITEMS_PER_PAGE
  });

  const paginator = generateNavigationRow({
    page,
    itemsPerPage: ITEMS_PER_PAGE,
    total: Math.ceil(guilds.length / ITEMS_PER_PAGE)
  });

  if (guilds.length > 1) components.push(guildSelector);

  if (guilds.length > ITEMS_PER_PAGE) components.push(paginator);

  return components;
};

interface IGetPageSelector {
  server: Guild;
  guilds: IGuild[];
  page: number;
  limit: number;
  selectedGuildRoleId?: string;
}

const _getPageSelector = ({
  page,
  guilds,
  limit,
  selectedGuildRoleId,
  server
}: IGetPageSelector) => {
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
      label: guild.info.name
        ? guild.info.name
        : `Role: ${roleName ?? 'Not found'}`,
      description: guild.info.name
        ? `Role: ${roleName ?? 'Not found'}`
        : undefined,
      value: guild.roleId,
      default: guild.roleId === selectedGuildRoleId
    });
  });
  actionRow.addComponents(menu);
  return actionRow;
};

export const isSelectingGuild = (
  interaction: BaseInteraction
): interaction is StringSelectMenuInteraction => {
  return (
    interaction.isStringSelectMenu() &&
    interaction.customId === GUILD_SELECTOR_NAME
  );
};
