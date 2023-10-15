import type {Client, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import {userService} from '../../../services/database/user.service';
import {dailyReminder} from '../../idle-helper/reminder/daily-reminder';
import claimReminder from '../../idle-helper/reminder/claim-reminder';
import commandHelper from '../../idle-helper/command-helper';
import embedProvider from '../../idle-helper/embeds';
import {djsMessageHelper} from '../../discordjs/message';
import toggleUserChecker from '../../idle-helper/toggle-checker/user';
import {messageChecker} from '../message-checker';

interface IIdleClaim {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleClaim = async ({
  author,
  client,
  isSlashCommand,
  message
}: IIdleClaim) => {
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (messageChecker.claim.isIdleClaimSuccess({author, embed})) {
      await idleClaimSuccess({
        client,
        channelId: message.channel.id,
        author,
        message: collected
      });
      dailyReminder({
        client,
        channelId: message.channel.id,
        userId: author.id
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleClaimSuccess {
  client: Client;
  channelId: string;
  author: User;
  message: Message;
}

const idleClaimSuccess = async ({
  author,
  message,
  client
}: IIdleClaimSuccess) => {
  await userService.claimFarm({
    userId: author.id
  });
  await claimReminder.update({
    userId: author.id
  });
  const userToggle = await toggleUserChecker({
    userId: author.id
  });
  if (!userToggle?.calculator.claim) return;
  const isAllow = await checkUser({
    author,
    client,
    channelId: message.channel.id
  });
  if (!isAllow) return;
  await commandHelper.calculator.claim({
    client,
    message,
    author
  });
};

interface IUserChecker {
  author: User;
  channelId: string;
  client: Client;
}

const checkUser = async ({author, channelId, client}: IUserChecker) => {
  const userAccount = await userService.findUser({userId: author.id});
  let embed;
  if (!userAccount?.config.donorTier) {
    embed = embedProvider.setDonor();
  }
  if (embed) {
    await djsMessageHelper.send({
      options: {
        embeds: [embed]
      },
      client,
      channelId
    });
  }
  return !embed;
};

