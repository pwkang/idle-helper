import type {Client, EmbedBuilder, Guild} from 'discord.js';
import {guildService} from '../../../../services/database/guild.service';
import type {IGuild} from '@idle-helper/models';
import commandHelper from '../index';
import {djsMemberHelper} from '../../../discordjs/member';

interface IVerifyGuild {
  client: Client;
  server: Guild;
  userId: string;
}

export const verifyGuild = async ({userId, client, server}: IVerifyGuild) => {
  const roles = await getUserGuildRoles({
    client,
    userId,
    server
  });
  const userGuild = await guildService.findUserGuild({
    userId
  });
  let finalGuild: IGuild | null = userGuild;
  let embed: EmbedBuilder | null = null;

  if (roles && roles.size > 1) {
    embed = commandHelper.guild.renderMultipleGuildEmbed(roles);
  } else if (roles?.size === 1) {
    const guildRole = roles.first()!;
    const guild = await guildService.findGuild({
      serverId: server.id,
      roleId: guildRole.id
    });

    if (userGuild?.roleId !== guildRole.id)
      await guildService.registerUsersToGuild({
        usersId: [userId],
        serverId: server.id,
        roleId: guildRole.id
      });
    if (guild) finalGuild = guild;
  }

  if (userGuild && userGuild.serverId === server.id && !roles?.size) {
    await guildService.removeUserFromGuild({
      serverId: server.id,
      roleId: userGuild.roleId,
      userId
    });
    return {
      guild: null,
      errorEmbed: null
    };
  }

  return {
    guild: finalGuild,
    errorEmbed: embed
  };
};

export interface IGetUserGuildRoles {
  client: Client;
  server: Guild;
  userId: string;
}

export const getUserGuildRoles = async ({
  server,
  userId,
  client
}: IGetUserGuildRoles) => {
  const serverMember = await djsMemberHelper.getMember({
    serverId: server.id,
    client,
    userId
  });
  if (!serverMember) return null;
  const guildRoles = await guildService.getAllGuildRoles({serverId: server.id});
  return serverMember.roles.cache.filter((userRole) =>
    guildRoles.some((guildRole) => userRole.id === guildRole)
  );
};
