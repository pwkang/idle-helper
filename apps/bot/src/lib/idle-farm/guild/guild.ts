import {Client, Embed, Guild, Message, User} from 'discord.js';
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

export const idleGuild = async ({author, client, isSlashCommand, message}: IIdleGuild) => {
  if (message.mentions.users.size) return;
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isIdleGuild({embed})) {
      const result = await commandHelper.guild.verifyGuild({
        client,
        server: message.guild,
        userId: author.id,
      });
      if (result.errorEmbed) {
        await djsMessageHelper.send({
          client,
          channelId: message.channel.id,
          options: {
            embeds: [result.errorEmbed],
          },
        });
        return;
      }
      const userGuild = result.guild;
      if (!userGuild) return;
      const guildRoleId = userGuild?.roleId;
      await idleGuildSuccess({
        embed,
        guildRoleId,
        server: message.guild,
        isSlashCommand,
      });
      await guildService.registerUserToGuild({
        serverId: message.guild.id,
        roleId: guildRoleId,
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


interface IChecker {
  embed: Embed;
}

const isIdleGuild = ({embed}: IChecker) => embed.footer?.text.includes('Your guild was raided');
