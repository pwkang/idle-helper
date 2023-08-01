import {EmbedBuilder, User} from 'discord.js';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';

export interface IGetUserSettingsEmbed {
  author: User;
  userProfile: IUser;
}

interface IHelperSettings {
  icon: string;
  value: string;
}

export const _getUserSettingsEmbed = ({userProfile, author}: IGetUserSettingsEmbed) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s settings`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed)
    .setThumbnail(author.avatarURL());

  const helperSettings: IHelperSettings[] = [
    {
      icon: userProfile?.config.onOff ? ':bell:' : ':no_bell:',
      value: `Helper **${userProfile.config.onOff ? 'ON' : 'OFF'}**`,
    },
    {
      icon: BOT_EMOJI.other.farm,
      value: userProfile.farms.reminderHours.length ?
        `Remind to claim at **${userProfile.farms.reminderHours.join(', ')}** hours` :
        `Farm reminder is not net`,
    },
    {
      icon: ':satellite:',
      value: userProfile.config.channelId ? `Reminder send to ${messageFormatter.channel(userProfile.config.channelId)}` : 'Reminder channel is not set',
    },
  ];


  embed.addFields({
    name: 'IDLE Helper Settings',
    value: helperSettings.map((setting) => `${setting.icon} - ${setting.value}`).join('\n'),
  });

  return embed;
};
