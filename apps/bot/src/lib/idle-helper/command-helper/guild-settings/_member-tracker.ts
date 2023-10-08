import type {
  BaseMessageOptions,
  Client,
  Embed,
  Guild,
  GuildMember,
  Role,
  User} from 'discord.js';
import {
  EmbedBuilder
} from 'discord.js';
import {guildService} from '../../../../services/database/guild.service';
import messageFormatter from '../../../discordjs/message-formatter';
import type {IGuild} from '@idle-helper/models';
import {createIdleFarmCommandListener} from '../../../../utils/idle-farm-command-listener';
import messageReaders from '../../../idle-farm/message-readers';
import {djsMessageHelper} from '../../../discordjs/message';
import {
  BOT_COLOR,
  IDLE_FARM_CLICKABLE_SLASH_COMMANDS
} from '@idle-helper/constants';

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
  const cachedServerMembers = guildRole.members.map((member) => member);
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
    const info = messageReaders.guildList({embed});
    await djsMessageHelper.send({
      channelId,
      client,
      options: getMemberRoleStatusMessageOptions({
        cachedServerMembers,
        guild,
        embedUsersId: info.ids,
        embedUsernames: info.usernames
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
  cachedServerMembers: GuildMember[];
  guild: IGuild;
  embedUsersId: string[];
  embedUsernames: string[];
}

const getMemberRoleStatusMessageOptions = ({
  cachedServerMembers,
  guild,
  embedUsersId,
  embedUsernames
}: IGetMemberRoleStatusEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${guild.info.name} - members`
  });

  const membersWithRole = cachedServerMembers.filter(
    (member) =>
      embedUsernames.includes(member.user.username) ||
      embedUsersId.includes(member.user.id)
  );

  const nonCachedMembersUsername = embedUsernames.filter(
    (username) =>
      !cachedServerMembers.some((member) => member.user.username === username)
  );
  const nonCachedMembersId = embedUsersId.filter(
    (id) => !cachedServerMembers.some((member) => member.user.id === id)
  );

  const nonMembersWithRole = cachedServerMembers.filter(
    (member) =>
      !embedUsernames.includes(member.user.username) &&
      !embedUsersId.includes(member.user.id)
  );

  for (let i = 0; i < membersWithRole.length; i += 30) {
    embed.addFields({
      name: 'Members with role',
      value: membersWithRole.slice(i, i + 30).length
        ? membersWithRole
          .slice(i, i + 30)
          .map((member) => messageFormatter.user(member.user.id))
          .join('\n')
        : 'None',
      inline: true
    });
  }

  for (let i = 0; i < nonMembersWithRole.length; i += 30) {
    embed.addFields({
      name: 'Non-members with role',
      value: nonMembersWithRole.slice(i, i + 30).length
        ? nonMembersWithRole
          .slice(i, i + 30)
          .map((member) => messageFormatter.user(member.user.id))
          .join('\n')
        : 'None',
      inline: true
    });
  }

  let content = '';
  if (
    nonMembersWithRole.length ||
    nonCachedMembersId.length ||
    nonCachedMembersUsername.length
  ) {
    content = [
      'These users are not cached yet, they either left the server or not active in this server',
      'Mentions these users in any private channel bot has access to and use this command again',
      `\`\`\`${nonCachedMembersId.map(
        messageFormatter.user
      )} ${nonCachedMembersUsername.map((username) => `@${username}`)}\`\`\``
    ].join('\n');
  }

  return {
    embeds: [embed],
    content
  };
};

interface IChecker {
  embed: Embed;
  guildName: string;
}

const isGuildList = ({embed, guildName}: IChecker) =>
  embed.fields[0]?.name === `**${guildName}** members`;
