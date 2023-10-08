import type {Client, Message, User} from 'discord.js';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';
import {djsMessageHelper} from '../../../discordjs/message';
import {infoService} from '../../../../services/database/info.service';
import {userService} from '../../../../services/database/user.service';
import type { IAllItems} from './generate-idlons-embed';
import {generateEmbed} from './generate-idlons-embed';
import messageReaders from '../../../idle-farm/message-readers';

interface IIdlonsCalculator {
  message: Message;
  author: User;
  client: Client;
}

export const _inventoryCalculator = async ({
  message,
  client,
  author
}: IIdlonsCalculator) => {
  let allItems: IAllItems = {};
  const inventory = messageReaders.inventory({
    embed: message.embeds[0]
  });
  const userAccount = await userService.findUser({userId: author.id});
  if (!userAccount) return;
  const marketItems = await infoService.getMarketItems();
  allItems = {
    ...inventory
  };
  const sentMessage = await djsMessageHelper.send({
    options: {
      embeds: [
        generateEmbed({
          items: allItems,
          marketItems,
          author,
          user: userAccount,
          title: 'Idlons Calculator'
        })
      ]
    },
    client,
    channelId: message.channel.id
  });
  const event = await createMessageEditedListener({
    messageId: message.id
  });
  if (!event || !sentMessage) return;
  event.on(message.id, (collected) => {
    const embed = collected.embeds[0];
    const updatedInventory = messageReaders.inventory({
      embed
    });
    allItems = {
      ...allItems,
      ...updatedInventory
    };
    const updatedEmbed = generateEmbed({
      items: allItems,
      marketItems,
      author,
      user: userAccount,
      title: 'Idlons Calculator'
    });
    djsMessageHelper.edit({
      options: {
        embeds: [updatedEmbed]
      },
      client,
      message: sentMessage
    });
  });
};
