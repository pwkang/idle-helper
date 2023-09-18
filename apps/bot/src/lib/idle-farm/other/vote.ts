import {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import messageReaders from '../message-readers';
import {userService} from '../../../services/database/user.service';

interface IIdleVote {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleVote = ({author, client, isSlashCommand, message}: IIdleVote) => {
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isIdleVote({embed})) {
      idleVoteSuccess({
        message: collected,
        author,
      });
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleMarketSuccess {
  message: Message;
  author: User;
}

const idleVoteSuccess = async ({message, author}: IIdleMarketSuccess) => {
  const voteInfo = messageReaders.vote(message.embeds[0]);
  if (voteInfo.readyIn) {
    await userService.registerReminder({
      userId: author.id,
      readyAt: new Date(Date.now() + voteInfo.readyIn),
      reminder: 'vote',
    });
  } else {
    await userService.removeReminder({
      userId: author.id,
      reminder: 'vote',
    });
  }
};

interface IChecker {
  embed: Embed;
}

const isIdleVote = ({embed}: IChecker) =>
  embed.title?.includes('Vote for IDLE FARM');
