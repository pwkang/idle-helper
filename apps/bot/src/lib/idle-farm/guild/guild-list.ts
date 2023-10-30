import type {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import messageReaders from '../message-readers';
import commandHelper from '../../idle-helper/command-helper';
import {djsMessageHelper} from '../../discordjs/message';
import {guildService} from '../../../services/database/guild.service';
import {djsMemberHelper} from '../../discordjs/member';
import {djsServerHelper} from '../../discordjs/server';

interface IIdleGuild {
  client: Client;
  message: Message<true>;
  author: User;
  isSlashCommand?: boolean;
}

export const idleGuildList = async ({
  author,
  client,
  isSlashCommand,
  message
}: IIdleGuild) => {
  if (message.mentions.users.size) return;
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isIdleGuildList({embed})) {
      event?.stop();
      const result = await commandHelper.guild.verifyGuild({
        client,
        server: message.guild,
        userId: author.id
      });
      if (result.errorEmbed) {
        await djsMessageHelper.send({
          client,
          channelId: message.channel.id,
          options: {
            embeds: [result.errorEmbed]
          }
        });
        return;
      }
      const userGuild = result.guild;
      if (!userGuild) return;
      await idleGuildListSuccess({
        embed,
        guildRoleId: userGuild.roleId,
        guildServerId: userGuild.serverId,
        author,
        client,
        serverId: message.guild.id
      });
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleGuildSuccess {
  embed: Embed;
  guildRoleId: string;
  guildServerId: string;
  author: User;
  client: Client;
  serverId: string;
}

const idleGuildListSuccess = async ({
  embed,
  guildRoleId,
  guildServerId,
  client,
  serverId
}: IIdleGuildSuccess) => {
  if (serverId !== guildServerId) return;
  await djsMemberHelper.fetchAllMembers({
    client,
    serverId
  });
  const server = await djsServerHelper.getServer({
    serverId,
    client
  });
  if (!server) return;
  const guildInfo = messageReaders.guildList({embed, guild: server});

  await guildService.registerUsersToGuild({
    serverId: guildServerId,
    roleId: guildRoleId,
    usersId: guildInfo.ids
  });
};

interface IChecker {
  embed: Embed;
}

const isIdleGuildList = ({embed}: IChecker) =>
  embed.fields[0]?.name.match(/members$/);
