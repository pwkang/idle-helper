import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';

export const NAVIGATION_ROW_BUTTONS = {
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
  const prevPage = Math.max(page - 1, 0);
  const lastPage = Math.ceil(total / itemsPerPage) - 1;
  const nextPage = Math.min(page + 1, lastPage);
  if (total > 2)
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('+0')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('⏪')
        .setDisabled(page === 0)
    );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`+0${prevPage}`)
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⬅️')
      .setDisabled(page === 0)
  );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`+00${nextPage}`)
      .setStyle(ButtonStyle.Primary)
      .setEmoji('➡️')
      .setDisabled(page === lastPage)
  );
  if (total > 2)
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`+000${lastPage}`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji('⏩')
        .setDisabled(page === lastPage)
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
