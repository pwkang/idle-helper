import type { User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import type {IUser} from '@idle-helper/models';
import {
  BOT_COLOR,
  BOT_EMOJI,
  IDLE_FARM_DONOR_TIER
} from '@idle-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';

export interface IGetUserSettingsEmbed {
  author: User;
  userProfile: IUser;
  guildName?: string;
  guildServerName?: string;
}

interface IHelperSettings {
  icon: string;
  value: string;
}

const DONOR_TIER_LABEL = {
  [IDLE_FARM_DONOR_TIER.nonDonor]: 'Non-donor',
  [IDLE_FARM_DONOR_TIER.common]: 'Common',
  [IDLE_FARM_DONOR_TIER.talented]: 'Talented',
  [IDLE_FARM_DONOR_TIER.wise]: 'Wise +'
} as const;

export const _getUserSettingsEmbed = ({
  userProfile,
  author,
  guildServerName,
  guildName
}: IGetUserSettingsEmbed) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s settings`,
      iconURL: author.avatarURL() ?? undefined
    })
    .setColor(BOT_COLOR.embed)
    .setThumbnail(author.avatarURL());

  const helperSettings: IHelperSettings[] = [
    {
      icon: userProfile?.config.onOff ? ':bell:' : ':no_bell:',
      value: `Helper **${userProfile.config.onOff ? 'ON' : 'OFF'}**`
    },
    {
      icon: BOT_EMOJI.other.farm,
      value: userProfile.farms.reminderHours.length
        ? `Remind to claim at **${userProfile.farms.reminderHours.join(
          ', '
        )}** hours`
        : 'Farm reminder is not net'
    },
    {
      icon: ':satellite:',
      value: userProfile.config.channelId
        ? `Reminder send to ${messageFormatter.channel(
          userProfile.config.channelId
        )}`
        : 'Reminder channel is not set'
    },
    {
      icon: BOT_EMOJI.other.idleCoin,
      value: `Donor tier: **${
        DONOR_TIER_LABEL[
          userProfile.config.donorTier ?? IDLE_FARM_DONOR_TIER.nonDonor
        ]
      }**`
    }
  ];

  if (guildName && guildServerName)
    helperSettings.push({
      icon: '🏰',
      value: `Guild: **${guildName}** @ ${guildServerName}`
    });

  embed.addFields({
    name: 'IDLE Helper Settings',
    value: helperSettings
      .map((setting) => `${setting.icon} - ${setting.value}`)
      .join('\n')
  });

  return embed;
};
