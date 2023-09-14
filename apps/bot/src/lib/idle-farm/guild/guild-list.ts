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

export const idleGuildList = async ({author, client, isSlashCommand, message}: IIdleGuild) => {
  if (message.mentions.users.size) return;
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isIdleGuildList({embed})) {
      event.stop();
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
      await idleGuildListSuccess({
        embed,
        guildRoleId,
        server: message.guild,
        author,
      });
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleGuildSuccess {
  embed: Embed;
  guildRoleId: string;
  server: Guild;
  author: User;
}

const idleGuildListSuccess = async ({
  embed,
  guildRoleId,
  server,
  author,
}: IIdleGuildSuccess) => {
  const guildInfo = messageReaders.guildList({embed});
  await guildService.registerUsersToGuild({
    serverId: server.id,
    roleId: guildRoleId,
    usersId: [author.id, ...guildInfo.ids],
  });
};


interface IChecker {
  embed: Embed;
}

const isIdleGuildList = ({embed}: IChecker) => embed.fields[0]?.name.match(/members$/);
