import type {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import messageReaders from '../message-readers';
import {userReminderServices} from '../../../services/database/user-reminder.service';
import toggleUserChecker from '../../idle-helper/toggle-checker/user';

interface IIdleVote {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleVote = ({
  author,
  client,
  isSlashCommand,
  message
}: IIdleVote) => {
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isIdleVote({embed})) {
      idleVoteSuccess({
        message: collected,
        author
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleMarketSuccess {
  message: Message;
  author: User;
}

const idleVoteSuccess = async ({message, author}: IIdleMarketSuccess) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id
  });

  if (!toggleChecker?.reminder?.vote) return;

  const voteInfo = messageReaders.vote(message.embeds[0]);
  if (voteInfo.readyIn) {
    await userReminderServices.saveUserVoteCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + voteInfo.readyIn)
    });
  } else {
    await userReminderServices.deleteUserCooldowns({
      userId: author.id,
      types: ['vote']
    });
  }
};

interface IChecker {
  embed: Embed;
}

const isIdleVote = ({embed}: IChecker) =>
  embed.title?.includes('Vote for IDLE FARM');
