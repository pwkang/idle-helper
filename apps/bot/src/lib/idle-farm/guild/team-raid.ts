import {Client, Embed, EmbedBuilder, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import {userService} from '../../../services/database/user.service';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';
import {calcWorkerPower} from '../calculator/worker-power';
import {djsMessageHelper} from '../../discordjs/message';

interface IIdleGuild {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleTeamRaid = async ({author, client, isSlashCommand, message}: IIdleGuild) => {
  if (!message.inGuild() || !!message.mentions.users.size) return;
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isAbleToStart({embed})) {
      sendConfirmationMessage({
        channelId: message.channel.id,
        client,
        users: message.mentions.users.map(user => user),
      });
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface ISendConfirmationMessage {
  channelId: string;
  client: Client;
  users: User[];
}

export const sendConfirmationMessage = async ({channelId, client, users}: ISendConfirmationMessage) => {
  const usersAccount = await userService.getUsersById({
    userIds: users.map(user => user.id),
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
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: 'Team Raid Confirmation',
    });

  for (const author of authors) {
    const user = users.find(user => user.userId === author.id)!;
    if (user) {
      const top3Workers = typedObjectEntries(user.workers)
        .map(([type, worker]) => ({
          level: worker.level,
          exp: worker.exp,
          maxExp: worker.maxExp,
          farm: worker.farm,
          type,
          power: calcWorkerPower({type, level: worker.level}),
        }))
        .sort((a, b) => b.power - a.power)
        .slice(0, 3);

      const totalPower = top3Workers.reduce((acc, worker) => acc + worker.power, 0);
      embed.addFields({
        name: `${author.username} • ${totalPower}`,
        value: top3Workers.map(worker => `${BOT_EMOJI.worker[worker.type]} Lv ${worker.level} | AT: ${worker.power}`).join('\n'),
        inline: true,
      });
    } else {
      embed.addFields({
        name: author.username,
        value: 'Workers not found',
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
