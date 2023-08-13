import {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import commandHelper from '../../idle-helper/command-helper';

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
      if (isCalc) {
        await commandHelper.inventory.idlonsCalculator({
          message: collected,
          author,
          client,
        });
      }
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

// interface IIdleInventorySuccess {
//   message: Message;
//   author: User;
//   client: Client;
// }
//
// const idleInventorySuccess = async ({message, author, client}: IIdleInventorySuccess) => {
//
// };

interface IChecker {
  author: User;
  embed: Embed;
}

const isIdleInventory = ({embed, author}: IChecker) =>
  embed.author?.name === `${author.username} — inventory`;
