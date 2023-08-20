import {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import {IMessageEmbedChecker} from '../../../types/utils';
import {userService} from '../../../services/database/user.service';
import {dailyReminder} from '../../idle-helper/reminder/daily-reminder';
import claimReminder from '../../idle-helper/reminder/claim-reminder';
import messageReaders from '../embed-readers';

interface IIdleClaim {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export const idleClaim = async ({author, client, isSlashCommand, message}: IIdleClaim) => {
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isIdleClaimSuccess({author, embed})) {
      await idleClaimSuccess({
        client,
        channelId: message.channel.id,
        author,
        embed,
      });
      dailyReminder({
        client,
        channelId: message.channel.id,
        userId: author.id,
      });
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleClaimSuccess {
  client: Client;
  channelId: string;
  author: User;
  embed: Embed;
}

const idleClaimSuccess = async ({author, embed}: IIdleClaimSuccess) => {
  await userService.claimFarm({
    userId: author.id,
  });
  await claimReminder.update({
    userId: author.id,
  });
  const items = messageReaders.claim({
    embed,
  });
  
};

const isIdleClaimSuccess = ({author, embed}: IMessageEmbedChecker) =>
  embed.author?.name === `${author.username} — claim`;
