import type {Client, Embed, Message, User} from 'discord.js';
import {createIdleFarmCommandListener} from '../../../utils/idle-farm-command-listener';
import {createMessageEditedListener} from '../../../utils/message-edited-listener';
import messageReaders from '../message-readers';
import {infoService} from '../../../services/database/info.service';

interface IIdleMarket {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
  toCheckItems?: boolean;
}

export const idleMarket = ({
  author,
  client,
  isSlashCommand,
  message,
  toCheckItems = true
}: IIdleMarket) => {
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isMarketDaily({embed})) {
      idleMarketSuccess({
        message: collected,
        toCheckItems
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
  toCheckItems?: boolean;
}

const idleMarketSuccess = async ({message, toCheckItems}: IIdleMarketSuccess) => {
  const event = await createMessageEditedListener({
    messageId: message.id
  });
  if (!event) return;
  event.on(message.id, (collected) => {
    marketPageChanged({embed: collected.embeds[0], toCheckItems});
  });
};

interface IMarketPageChanged {
  embed: Embed;
  toCheckItems?: boolean;
}

const marketPageChanged = ({embed, toCheckItems}: IMarketPageChanged) => {
  const marketItems = messageReaders.market({
    embed
  });
  marketItems.items.forEach((item) => {
    infoService.updateMarketItems({
      isOverstocked: item.isOverstocked,
      type: item.type,
      price: item.price,
      rate: item.priceRate
    });
  });
  if (toCheckItems && marketItems.nonRegisteredItems.length) {
    console.log(marketItems.nonRegisteredItems);

  }
};


interface IChecker {
  embed: Embed;
}

const isMarketDaily = ({embed}: IChecker) =>
  embed.description?.includes('This is the **idle market**!');
