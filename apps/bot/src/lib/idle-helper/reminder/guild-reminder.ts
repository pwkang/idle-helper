import type {Client} from 'discord.js';
import {guildService} from '../../../services/database/guild.service';
import {djsMessageHelper} from '../../discordjs/message';
import toggleGuildChecker from '../toggle-checker/guild';

interface IGuildReminderTimesUp {
  client: Client;
  serverId: string;
  guildRoleId: string;
}

export const guildReminderTimesUp = async ({
  guildRoleId,
  client,
  serverId
}: IGuildReminderTimesUp) => {
  const guild = await guildService.findGuild({
    serverId,
    roleId: guildRoleId
  });
  if (!guild) return;
  const toggleGuild = await toggleGuildChecker({
    guildRoleId,
    serverId
  });
  if (!toggleGuild?.teamRaid?.reminder) return;

  await djsMessageHelper.send({
    client,
    channelId: guild.teamRaid.channelId,
    options: {
      content: guild.teamRaid.message
    }
  });
};
