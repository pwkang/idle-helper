import {Client, Guild} from 'discord.js';
import {djsMemberHelper} from '../../../discordjs/member';
import {guildService} from '../../../../services/database/guild.service';

export interface IGetUserGuildRoles {
  client: Client;
  server: Guild;
  userId: string;
}

export const _getUserGuildRoles = async ({server, userId, client}: IGetUserGuildRoles) => {
  const serverMember = await djsMemberHelper.getMember({
    serverId: server.id,
    client,
    userId,
  });
  if (!serverMember) return null;
  const guilds = await guildService.getAllGuildRoles({serverId: server.id});
  return serverMember.roles.cache.filter((userRole) =>
    guilds.some((guildRole) => userRole.id === guildRole.roleId),
  );
};
