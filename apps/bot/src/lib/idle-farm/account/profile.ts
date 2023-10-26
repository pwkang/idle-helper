import type {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import {userService} from '../../../services/database/user.service';
import {getLastClaimEmbed} from '../../idle-helper/command-helper/farms/status';
import {djsMessageHelper} from '../../discordjs/message';
import toggleUserChecker from '../../idle-helper/toggle-checker/user';
import messageReaders from '../message-readers';

interface IIdleProfile {
  client: Client;
  message: Message<true>;
  author: User;
  isSlashCommand?: boolean;
}

export const idleProfile = ({
  author,
  client,
  isSlashCommand,
  message
}: IIdleProfile) => {
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isIdleProfile({embed, author})) {
      event?.stop();
      await idleProfileSuccess({embed, author, message: collected, client});
    }
  });

  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleProfileSuccess {
  embed: Embed;
  author: User;
  message: Message<true>;
  client: Client;
}

const idleProfileSuccess = async ({
  author,
  message,
  client
}: IIdleProfileSuccess) => {
  const userAccount = await userService.findUser({
    userId: author.id
  });
  if (!userAccount) return;
  const toggleUser = await toggleUserChecker({
    userId: author.id
  });
  const profile = messageReaders.profile({
    embed: message.embeds[0]
  });

  await userService.saveGameProfile({
    energy: profile.energy,
    idleCoins: profile.idleCoins,
    userId: author.id,
    idlons: profile.idlons,
    idlucks: profile.idlucks,
    league: profile.league
  });

  if (toggleUser?.autoSend?.profile) {
    const lastClaimEmbed = getLastClaimEmbed({
      author,
      userAccount
    });
    await djsMessageHelper.send({
      client,
      channelId: message.channelId,
      options: {
        embeds: [lastClaimEmbed]
      }
    });
  }
};

const isIdleProfile = ({embed, author}: {embed: any; author: User}) =>
  embed.author?.name === `${author.username} — profile`;
