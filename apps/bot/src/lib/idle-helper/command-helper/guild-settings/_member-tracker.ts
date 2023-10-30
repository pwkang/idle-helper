import type {BaseMessageOptions, Client, Embed, Guild, Role, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {guildService} from '../../../../services/database/guild.service';
import messageFormatter from '../../../discordjs/message-formatter';
import type {IGuild} from '@idle-helper/models';
import {createIdleFarmCommandListener} from '../../../../utils/idle-farm-command-listener';
import messageReaders from '../../../idle-farm/message-readers';
import {djsMessageHelper} from '../../../discordjs/message';
import {BOT_COLOR, IDLE_FARM_CLICKABLE_SLASH_COMMANDS} from '@idle-helper/constants';
import {djsMemberHelper} from '../../../discordjs/member';

interface IMemberTracker {
  server: Guild;
  guildRole: Role;
  client: Client;
  channelId: string;
  author: User;
}

// const INFO_TYPE = {
//   guildRole: 'guildRole',
//   worker: 'worker',
//   raidPoints: 'raidPoints',
// } as const;

export const _memberTracker = async ({
  guildRole,
  server,
  client,
  channelId,
  author
}: IMemberTracker) => {
  const guild = await guildService.findGuild({
    serverId: server.id,
    roleId: guildRole.id
  });

  // const databaseMembers = await guildService.getAllGuildMembers({
  //   serverId: server.id,
  //   roleId: guildRole.id,
  // });
  // const users = await userService.getUsersById({
  //   userIds: databaseMembers,
  // });
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId
  });
  if (!event || !guild) return null;

  const getMessagePayload = (): BaseMessageOptions => {
    if (!guild)
      return {
        content: `There is no guild with role ${messageFormatter.role(
          guildRole.id
        )} setup in this server`
      };
    return {
      content: `Type \`idle guild list\` or use ${IDLE_FARM_CLICKABLE_SLASH_COMMANDS.guildList}`
    };
  };

  event.on('embed', async (embed) => {
    if (!isGuildList({embed, guildName: guild.info.name})) return;

    await djsMemberHelper.fetchAllMembers({
      serverId: server.id,
      client
    });

    const info = messageReaders.guildList({embed, guild: server});
    await djsMessageHelper.send({
      channelId,
      client,
      options: getMemberRoleStatusMessageOptions({
        guild,
        server,
        guildRoleId: guildRole.id,
        guildMembersId: info.ids
      })
    });
    event?.stop();
  });

  event.on('end', () => {
    event = undefined;
  });

  return {
    getMessagePayload
  };
};

interface IGetMemberRoleStatusEmbed {
  guild: IGuild;
  guildMembersId: string[];
  server: Guild;
  guildRoleId: string;
}

const getMemberRoleStatusMessageOptions = ({
  guild,
  server,
  guildRoleId,
  guildMembersId
}: IGetMemberRoleStatusEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${guild.info.name} - members`
  });

  const nonMembersWithRole = [
    ...server.members.cache.filter(member =>
      guildMembersId.every(id => id !== member.id) &&
      member.roles.cache.has(guildRoleId)).values()
  ];

  const membersNotInServer = guildMembersId.filter(id => !server.members.cache.has(id));

  for (let i = 0; i < nonMembersWithRole.length; i += 30) {
    embed.addFields({
      name: 'Non members with role',
      value: nonMembersWithRole.slice(i, i + 30).length
        ? nonMembersWithRole
          .slice(i, i + 30)
          .map((member) => messageFormatter.user(member.user.id))
          .join('\n')
        : 'None',
      inline: true
    });
  }

  for (let i = 0; i < membersNotInServer.length; i += 30) {
    embed.addFields({
      name: 'Members not in server',
      value: membersNotInServer.slice(i, i + 30).length
        ? membersNotInServer
          .slice(i, i + 30)
          .map((member) => messageFormatter.user(member))
          .join('\n')
        : 'None',
      inline: true
    });
  }

  return {
    embeds: [embed]
  };
};

interface IChecker {
  embed: Embed;
  guildName: string;
}

const isGuildList = ({embed, guildName}: IChecker) =>
  embed.fields[0]?.name === `**${guildName}** members`;
