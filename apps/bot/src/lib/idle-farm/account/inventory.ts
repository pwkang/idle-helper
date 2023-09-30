import {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import commandHelper from '../../idle-helper/command-helper';
import {userService} from '../../../services/database/user.service';
import {djsMessageHelper} from '../../discordjs/message';
import embedProvider from '../../idle-helper/embeds';
import toggleUserChecker from '../../idle-helper/toggle-checker/user';
import messageReaders from '../message-readers';
import {createMessageEditedListener} from '../../../utils/message-edited-listener';

interface IIdleInventory {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
  isCalc?: boolean;
}

export const idleInventory = ({
  author,
  client,
  isSlashCommand,
  message,
  isCalc,
}: IIdleInventory) => {
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isIdleInventory({embed, author})) {
      event?.stop();
      if (isCalc) {
        const userToggle = await toggleUserChecker({
          userId: author.id,
        });
        if (!userToggle?.calculator.inventory) return;
        const isAllow = await checkUser({author, channelId: message.channel.id, client});
        if (!isAllow) return;
        await commandHelper.calculator.inventory({
          message: collected,
          author,
          client,
        });
      }
      idleInventorySuccess({
        author,
        message: collected,
      });
    }
  });
  event.on('end', () => {
    event = undefined;
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

interface IIdleInventorySuccess {
  message: Message;
  author: User;
}

const idleInventorySuccess = async ({message, author}: IIdleInventorySuccess) => {
  const userAccount = await userService.findUser({
    userId: author.id,
  });
  if (!userAccount) return;
  saveWorkerTokens({
    author,
    message,
  });
  const event = await createMessageEditedListener({
    messageId: message.id,
  });
  if (!event) return;
  event.on(message.id, (collected) => {
    saveWorkerTokens({
      message: collected,
      author,
    });
  });
};

interface ISaveInventory {
  message: Message;
  author: User;
}

const saveWorkerTokens = async ({message, author}: ISaveInventory) => {
  const inventory = messageReaders.inventory({
    embed: message.embeds[0],
  });
  if (inventory.workerTokens === undefined) return;
  await userService.saveInventory({
    userId: author.id,
    items: [
      {
        name: 'workerTokens',
        amount: inventory.workerTokens ?? 0,
      },
    ],
  });
};

interface IChecker {
  author: User;
  embed: Embed;
}

const isIdleInventory = ({embed, author}: IChecker) =>
  embed.author?.name === `${author.username} — inventory`;
