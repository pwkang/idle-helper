import type {Client, Message, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {infoService} from '../../../../services/database/info.service';
import {generateEmbed} from './generate-idlons-embed';
import {djsMessageHelper} from '../../../discordjs/message';
import messageReaders from '../../../idle-farm/message-readers';

interface IClaimCalculator {
  message: Message;
  author: User;
  client: Client;
}

export const _claimCalculator = async ({
  author,
  client,
  message
}: IClaimCalculator) => {
  const items = messageReaders.claim({
    embed: message.embeds[0]
  });
  const userAccount = await userService.findUser({
    userId: author.id
  });
  if (!userAccount) return;
  const marketItems = await infoService.getMarketItems();
  const embed = generateEmbed({
    items,
    marketItems,
    author,
    user: userAccount,
    title: 'Claim Calculator'
  });
  await djsMessageHelper.send({
    options: {
      embeds: [embed]
    },
    client,
    channelId: message.channel.id
  });
};
