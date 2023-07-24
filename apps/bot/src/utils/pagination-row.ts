import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';

export const NAVIGATION_ROW_BUTTONS = {
  first: 'first',
  prev: 'prev',
  next: 'next',
  last: 'last',
  all: 'all',
} as const;

interface IGenerateNavigationRow {
  page: number;
  total: number;
  itemsPerPage: number;
  all?: boolean;
}

export const generateNavigationRow = ({page, total, itemsPerPage, all}: IGenerateNavigationRow) => {
  const row = new ActionRowBuilder<ButtonBuilder>();
  if (total > 2)
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(NAVIGATION_ROW_BUTTONS.first)
        .setStyle(ButtonStyle.Primary)
        .setEmoji('⏪')
        .setDisabled(page === 0)
    );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(NAVIGATION_ROW_BUTTONS.prev)
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⬅️')
      .setDisabled(page === 0)
  );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(NAVIGATION_ROW_BUTTONS.next)
      .setStyle(ButtonStyle.Primary)
      .setEmoji('➡️')
      .setDisabled(page === Math.floor(total / itemsPerPage))
  );
  if (total > 2)
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(NAVIGATION_ROW_BUTTONS.last)
        .setStyle(ButtonStyle.Primary)
        .setEmoji('⏩')
        .setDisabled(page === Math.floor(total / itemsPerPage))
    );
  if (all)
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(NAVIGATION_ROW_BUTTONS.all)
        .setStyle(ButtonStyle.Primary)
        .setLabel('All')
    );
  return row;
};
