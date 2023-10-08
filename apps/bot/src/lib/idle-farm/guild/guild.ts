import type {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import messageReaders from '../message-readers';
import commandHelper from '../../idle-helper/command-helper';
import {djsMessageHelper} from '../../discordjs/message';
import {guildService} from '../../../services/database/guild.service';

interface IIdleGuild {
  client: Client;
  message: Message<true>;
  author: User;
  isSlashCommand?: boolean;
}

export const idleGuild = async ({
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
    if (isIdleGuild({embed})) {
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
      const guildRoleId = userGuild?.roleId;
      await idleGuildSuccess({
        embed,
        guildRoleId,
        guildServerId: userGuild.serverId,
        isSlashCommand
      });
      await guildService.registerUsersToGuild({
        serverId: message.guild.id,
        roleId: guildRoleId,
        usersId: [author.id]
      });
      event?.stop();
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
  isSlashCommand?: boolean;
  guildServerId: string;
}

const idleGuildSuccess = async ({
  embed,
  guildRoleId,
  isSlashCommand,
  guildServerId
}: IIdleGuildSuccess) => {
  const guildInfo = messageReaders.guild({embed});
  if (isSlashCommand) {

    // return if guild name is not matched in slash command
    const currentGuild = await guildService.findGuild({
      serverId: guildServerId,
      roleId: guildRoleId
    });
    if (currentGuild && currentGuild.info.name !== guildInfo.name) return;
  }
  const guild = await guildService.registerReminder({
    readyIn: guildInfo.readyIn,
    roleId: guildRoleId,
    serverId: guildServerId
  });
  if (!guild) return;
  await guildService.updateGuildInfo({
    serverId: guildServerId,
    roleId: guildRoleId,
    name: guildInfo.name === guild.info.name ? undefined : guildInfo.name
  });
};

interface IChecker {
  embed: Embed;
}

const isIdleGuild = ({embed}: IChecker) =>
  embed.footer?.text.includes('Your guild was raided');
