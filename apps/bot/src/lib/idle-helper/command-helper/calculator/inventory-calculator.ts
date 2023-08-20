import {Client, Message, User} from 'discord.js';
import embedReaders from '../../../idle-farm/embed-readers';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';
import {djsMessageHelper} from '../../../discordjs/message';
import {infoService} from '../../../../services/database/info.service';
import {userService} from '../../../../services/database/user.service';
import {generateEmbed, IAllItems} from './generate-idlons-embed';

interface IIdlonsCalculator {
  message: Message;
  author: User;
  client: Client;
}


export const _inventoryCalculator = async ({message, client, author}: IIdlonsCalculator) => {
  let allItems: IAllItems = {};
  const inventory = embedReaders.inventory({
    embed: message.embeds[0],
  });
  const userAccount = await userService.findUser({userId: author.id});
  if (!userAccount) return;
  const marketItems = await infoService.getMarketItems();
  allItems = {
    ...inventory,
  };
  const sentMessage = await djsMessageHelper.send({
    options: {
      embeds: [
        generateEmbed({
          items: allItems,
          marketItems,
          author,
          user: userAccount,
          title: 'Idlons Calculator',
        }),
      ],
    },
    client,
    channelId: message.channel.id,
  });
  const event = await createMessageEditedListener({
    messageId: message.id,
  });
  if (!event || !sentMessage) return;
  event.on('edited', (collected) => {
    const embed = collected.embeds[0];
    const updatedInventory = embedReaders.inventory({
      embed,
    });
    allItems = {
      ...allItems,
      ...updatedInventory,
    };
    const updatedEmbed = generateEmbed({
      items: allItems,
      marketItems,
      author,
      user: userAccount,
      title: 'Idlons Calculator',
    });
    djsMessageHelper.edit({
      options: {
        embeds: [updatedEmbed],
      },
      client,
      message: sentMessage,
    });
  });
};
