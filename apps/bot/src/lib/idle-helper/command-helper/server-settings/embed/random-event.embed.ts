import {EmbedBuilder} from 'discord.js';
import {IServerSettings} from '../type';
import {BOT_COLOR, IDLE_FARM_RANDOM_EVENTS} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

export const _getRandomEventSettingsEmbed = ({serverAccount, guild}: IServerSettings) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${guild.name}'s random event settings`,
      iconURL: guild.iconURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed);

  for (let [key, label] of typedObjectEntries(IDLE_FARM_RANDOM_EVENTS)) {
    embed.addFields({
      name: label,
      value: serverAccount?.settings.randomEvent[key] ?? '-',
    });
  }

  return embed;
};
