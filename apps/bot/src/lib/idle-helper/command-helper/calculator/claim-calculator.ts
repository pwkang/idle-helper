import {Client, Message, User} from 'discord.js';
import embedReaders from '../../../idle-farm/embed-readers';
import {userService} from '../../../../services/database/user.service';
import {infoService} from '../../../../services/database/info.service';
import {generateEmbed} from './generate-idlons-embed';
import {djsMessageHelper} from '../../../discordjs/message';

interface IClaimCalculator {
  message: Message;
  author: User;
  client: Client;
}

export const _claimCalculator = async ({author, client, message}: IClaimCalculator) => {
  const items = embedReaders.claim({
    embed: message.embeds[0],
  });
  const userAccount = await userService.findUser({
    userId: author.id,
  });
  if (!userAccount) return;
  const marketItems = await infoService.getMarketItems();
  const embed = generateEmbed({
    items,
    marketItems,
    author,
    user: userAccount,
    title: 'Claim Calculator',
  });
  await djsMessageHelper.send({
    options: {
      embeds: [embed],
    },
    client,
    channelId: message.channel.id,
  });

};