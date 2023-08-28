import {Client, Embed, EmbedBuilder, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import {userService} from '../../../services/database/user.service';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';
import {calcWorkerPower} from '../calculator/worker-power';
import {djsMessageHelper} from '../../discordjs/message';
import commandHelper from '../../idle-helper/command-helper';
import toggleGuildChecker from '../../idle-helper/toggle-checker/guild';

interface IIdleGuild {
  client: Client;
  message: Message<true>;
  author: User;
  isSlashCommand?: boolean;
}

export const idleTeamRaid = async ({author, client, isSlashCommand, message}: IIdleGuild) => {
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  const involvedUsers = [message.author, ...message.mentions.users.map((user) => user)];
  event.on('embed', async (embed, collected) => {
    if (isAbleToStart({embed})) {
      const roles = await commandHelper.guild.getUserGuildRoles({
        client,
        server: message.guild,
        userId: message.author.id,
      });
      if (!roles?.size) {
        return event.stop();
      }
      if (roles.size > 1) {
        await djsMessageHelper.send({
          channelId: message.channel.id,
          client,
          options: {
            embeds: [commandHelper.guild.renderMultipleGuildEmbed(roles)],
          },
        });
        return event.stop();
      }
      const guildRoleId = roles.first()!.id;
      const toggleGuild = await toggleGuildChecker({
        guildRoleId,
        serverId: message.guild.id,
      });
      if (!toggleGuild?.teamRaid.helper) return event.stop();

      await sendConfirmationMessage({
        channelId: message.channel.id,
        client,
        users: involvedUsers,
      });
    }
    if (isTeamRaid(embed)) {
      await commandHelper.raid.teamRaid({
        channelId: message.channel.id,
        collected,
        users: involvedUsers,
        client,
      });
      event.stop();
    }
  });
  event.on('content', async (_, collected) => {
    if (
      isNotEnoughPlayer(collected) ||
      hasOtherGuildMember(collected) ||
      hasNotEnoughPower(collected) ||
      hasNotReachDirt2(collected)
    ) {
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface ISendConfirmationMessage {
  channelId: string;
  client: Client;
  users: User[];
}

export const sendConfirmationMessage = async ({
  channelId,
  client,
  users,
}: ISendConfirmationMessage) => {
  const usersAccount = await userService.getUsersById({
    userIds: users.map((user) => user.id),
  });

  const embed = generateConfirmationEmbed({
    users: usersAccount,
    authors: users,
  });
  await djsMessageHelper.send({
    channelId,
    client,
    options: {
      embeds: [embed],
    },
  });
};

interface IGenerateConfirmationEmbed {
  users: IUser[];
  authors: User[];
}

const generateConfirmationEmbed = ({authors, users}: IGenerateConfirmationEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: 'Team Raid Confirmation',
  });

  for (const author of authors) {
    const user = users.find((user) => user.userId === author.id)!;
    if (user) {
      const top3Workers = typedObjectEntries(user.workers)
        .map(([type, worker]) => ({
          level: worker.level,
          exp: worker.exp,
          maxExp: worker.maxExp,
          farm: worker.farm,
          type,
          power: calcWorkerPower({type, level: worker.level, decimalPlace: 3}),
        }))
        .sort((a, b) => b.power - a.power)
        .slice(0, 3);

      const totalPower = top3Workers.reduce((acc, worker) => acc + worker.power, 0);
      embed.addFields({
        name: `${author.username} • ${totalPower}`,
        value: top3Workers
          .map(
            (worker) => `${BOT_EMOJI.worker[worker.type]} Lv ${worker.level} | AT: ${worker.power}`
          )
          .join('\n'),
        inline: true,
      });
    } else {
      embed.addFields({
        name: author.username,
        value: 'Workers not registered',
        inline: true,
      });
    }
  }

  return embed;
};

interface IIsAbleToStart {
  embed: Embed;
}

const isAbleToStart = ({embed}: IIsAbleToStart) =>
  embed.description?.includes('All players have to agree');

const isTeamRaid = (embed: Embed) => embed.description?.includes('You are raiding');

const isNotEnoughPlayer = (message: Message) =>
  message.content.includes('you need at least 2 players');

const hasOtherGuildMember = (message: Message) =>
  message.content.includes('with players of your guild');

const hasNotEnoughPower = (message: Message) =>
  message.content.includes('The following player(s) do not have at least 80 energy');

const hasNotReachDirt2 = (message: Message) => message.content.includes('dirt league II');
