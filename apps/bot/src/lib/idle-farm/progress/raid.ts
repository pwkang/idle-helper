import {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import {userService} from '../../../services/database/user.service';
import {dailyReminder} from '../../idle-helper/reminder/daily-reminder';
import toggleUserChecker from '../../idle-helper/toggle-checker/user';
import commandHelper from '../../idle-helper/command-helper';

interface IIdleRaid {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleRaid = async ({author, client, isSlashCommand, message}: IIdleRaid) => {
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isIdleRaid({author, embed})) {
      idleRaidSuccess({raidMessage: collected, author, client});
      dailyReminder({
        client,
        channelId: message.channel.id,
        userId: author.id,
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleWorkerSuccess {
  client: Client;
  author: User;
  raidMessage: Message;
}

const idleRaidSuccess = async ({author, client, raidMessage}: IIdleWorkerSuccess) => {
  const userToggle = await toggleUserChecker({userId: author.id});
  if (!userToggle?.raidHelper) return;
  const user = await userService.findUser({userId: author.id});
  if (!user) return;

  await commandHelper.raid.player({
    message: raidMessage,
    client,
    userAccount: user,
  });
};

interface IChecker {
  author: User;
  embed: Embed;
}

const isIdleRaid = ({author, embed}: IChecker) =>
  embed.author?.name === `${author.username} — raid`;
