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
}

export const idleMarket = ({
  author,
  client,
  isSlashCommand,
  message
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
        message: collected
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
}

const idleMarketSuccess = async ({message}: IIdleMarketSuccess) => {
  const event = await createMessageEditedListener({
    messageId: message.id
  });
  if (!event) return;
  event.on(message.id, (collected) => {
    marketPageChanged({embed: collected.embeds[0]});
  });
};

interface IMarketPageChanged {
  embed: Embed;
}

const marketPageChanged = ({embed}: IMarketPageChanged) => {
  const marketItems = messageReaders.market({
    embed
  });
  marketItems.forEach((item) => {
    infoService.updateMarketItems({
      isOverstocked: item.isOverstocked,
      type: item.type,
      price: item.price,
      rate: item.priceRate
    });
  });
};

interface IChecker {
  embed: Embed;
}

const isMarketDaily = ({embed}: IChecker) =>
  embed.description?.includes('This is the **idle market**!');
