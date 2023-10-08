import {EmbedBuilder} from 'discord.js';
import type {IServerSettings} from '../type';
import {BOT_COLOR, IDLE_FARM_RANDOM_EVENTS_NAME} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

export const _getRandomEventSettingsEmbed = ({
  serverAccount,
  guild
}: IServerSettings) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${guild.name}'s random event settings`,
      iconURL: guild.iconURL() ?? undefined
    })
    .setColor(BOT_COLOR.embed);

  for (const [key, label] of typedObjectEntries(IDLE_FARM_RANDOM_EVENTS_NAME)) {
    embed.addFields({
      name: label,
      value: serverAccount?.settings.randomEvent[key] ?? '-'
    });
  }

  embed.setFooter({
    text: 'Trying to disable? Type \'clear\' during configuration'
  });

  return embed;
};
