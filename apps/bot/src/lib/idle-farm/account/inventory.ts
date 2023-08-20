import {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import commandHelper from '../../idle-helper/command-helper';
import {userService} from '../../../services/database/user.service';
import {djsMessageHelper} from '../../discordjs/message';
import embedProvider from '../../idle-helper/embeds';

interface IIdleInventory {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
  isCalc?: boolean;
}

export const idleInventory = ({author, client, isSlashCommand, message, isCalc}: IIdleInventory) => {
  const event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isIdleInventory({embed, author})) {
      event.stop();
      if (isCalc) {
        const isAllow = await checkUser({author, channelId: message.channel.id, client});
        if (!isAllow) return;
        await commandHelper.calculator.inventory({
          message: collected,
          author,
          client,
        });
      }
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IUserChecker {
  author: User;
  channelId: string;
  client: Client;
}

const checkUser = async ({author, channelId, client}: IUserChecker) => {
  const userAccount = await userService.findUser({userId: author.id});
  let embed;
  if (!userAccount) {
    embed = embedProvider.howToRegister({
      author,
    });
  }
  if (!userAccount?.config.onOff) {
    embed = embedProvider.turnOnAccount();
  }
  if (!userAccount?.config.donorTier) {
    embed = embedProvider.setDonor();
  }
  if (embed) {
    await djsMessageHelper.send({
      options: {
        embeds: [embed],
      },
      client,
      channelId,
    });
  }
  return !embed;

};

interface IChecker {
  author: User;
  embed: Embed;
}

const isIdleInventory = ({embed, author}: IChecker) =>
  embed.author?.name === `${author.username} — inventory`;
