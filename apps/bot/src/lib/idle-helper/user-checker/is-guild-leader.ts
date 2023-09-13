import {guildService} from '../../../services/database/guild.service';

interface IsGuildLeader {
  serverId: string;
  guildRoleId: string;
  userId: string;
}

export const _isGuildLeader = async ({serverId, guildRoleId, userId}: IsGuildLeader) => {
  const guildAccount = await guildService.findGuild({
    roleId: guildRoleId,
    serverId,
  });
  return guildAccount?.leaderId === userId;
};
