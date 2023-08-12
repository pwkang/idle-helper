import messageFormatter from '../../../../discordjs/message-formatter';
import timestampHelper from '../../../../discordjs/timestamp';
import {IGuild} from '@idle-helper/models';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@idle-helper/constants';

export interface IGetGuildReminderEmbed {
  guildAccount: IGuild;
}

export const _getGuildSettingsEmbed = ({guildAccount}: IGetGuildReminderEmbed): EmbedBuilder => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle(`${guildAccount.info.name ?? ''} Settings`)
    .addFields(
      {
        name: 'Leader',
        value: guildAccount.leaderId ? messageFormatter.user(guildAccount.leaderId) : '-',
        inline: true,
      },
      {
        name: 'Guild Role',
        value: messageFormatter.role(guildAccount.roleId),
        inline: true,
      },
      {
        name: '🔔 REMINDER',
        value: [
          `**Channel:** ${
            guildAccount.teamRaid.channelId
              ? messageFormatter.channel(guildAccount.teamRaid.channelId)
              : '-'
          }`,
          `**Reminder Message:** ${guildAccount.teamRaid.message ?? '-'}`,
          `**Status:** ${
            guildAccount.teamRaid.readyAt && guildAccount.teamRaid.readyAt.getTime() > Date.now()
              ? timestampHelper.relative({time: guildAccount.teamRaid.readyAt})
              : 'Ready'
          }`,
        ].join('\n'),
        inline: false,
      }
    );

  return embed;
};
