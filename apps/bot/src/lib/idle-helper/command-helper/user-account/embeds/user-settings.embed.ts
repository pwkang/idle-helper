import {EmbedBuilder, User} from 'discord.js';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR} from '@idle-helper/constants';

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
  ];


  embed.addFields({
    name: 'IDLE Helper Settings',
    value: helperSettings.map((setting) => `${setting.icon} - ${setting.value}`).join('\n'),
  });

  return embed;
};
