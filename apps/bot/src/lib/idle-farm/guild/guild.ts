import {Client, Embed, Guild, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import messageReaders from '../embed-readers';
import commandHelper from '../../idle-helper/command-helper';
import {djsMessageHelper} from '../../discordjs/message';
import {guildService} from '../../../services/database/guild.service';
import {redisGuildMembers} from '../../../services/redis/guild-members.redis';

interface IIdleGuild {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleGuild = async ({author, client, isSlashCommand, message}: IIdleGuild) => {
  if (!message.inGuild() || !!message.mentions.users.size) return;
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isIdleGuild({embed})) {
      const roles = await commandHelper.guild.getUserGuildRoles({
        client: author.client,
        userId: author.id,
        server: message.guild,
      });
      if (!roles || !roles.size) return;
      if (roles.size > 1) {
        return djsMessageHelper.send({
          channelId: message.channel.id,
          client,
          options: {
            embeds: [commandHelper.guild.renderMultipleGuildEmbed(roles)],
          },
        });
      }
      const guildRole = roles.first()!;
      idleGuildSuccess({
        embed,
        guildRoleId: guildRole.id,
        server: message.guild,
        isSlashCommand,
      });
      registerUserToGuild({
        serverId: message.guild.id,
        roleId: guildRole.id,
        userId: author.id,
      });
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleGuildSuccess {
  embed: Embed;
  guildRoleId: string;
  isSlashCommand?: boolean;
  server: Guild;
}

const idleGuildSuccess = async ({
  embed,
  guildRoleId,
  isSlashCommand,
  server,
}: IIdleGuildSuccess) => {
  const guildInfo = messageReaders.guild({embed});
  if (isSlashCommand) {
    // return if guild name is not matched in slash command
    const currentGuild = await guildService.findGuild({
      serverId: server.id,
      roleId: guildRoleId,
    });
    if (currentGuild && currentGuild.info.name !== guildInfo.name) return;
  }
  const guild = await guildService.registerReminder({
    readyIn: guildInfo.readyIn,
    roleId: guildRoleId,
    serverId: server.id,
  });
  if (!guild) return;
  await guildService.updateGuildInfo({
    serverId: server.id,
    roleId: guildRoleId,
    name: guildInfo.name === guild.info.name ? undefined : guildInfo.name,
  });
};

interface IRegisterUserToGuild {
  userId: string;
  serverId: string;
  roleId: string;
}

const registerUserToGuild = async ({userId, serverId, roleId}: IRegisterUserToGuild) => {
  const cached = await redisGuildMembers.getGuildInfo({
    userId,
  });
  if (cached?.guildRoleId === roleId && cached?.serverId === serverId) return;
  await guildService.registerUserToGuild({
    userId,
    serverId,
    roleId,
  });
  await redisGuildMembers.setGuildMember({
    guildRoleId: roleId,
    serverId,
    userId,
  });
};

interface IChecker {
  embed: Embed;
}

const isIdleGuild = ({embed}: IChecker) => embed.footer?.text.includes('Your guild was raided');
