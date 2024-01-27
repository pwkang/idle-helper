import type {Client, Message, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {infoService} from '../../../../services/database/info.service';
import {generateIdlonsEmbed} from './generate-idlons-embed';
import {djsMessageHelper} from '../../../discordjs/message';
import messageReaders from '../../../idle-farm/message-readers';
import {createIdleFarmCommandListener} from '../../../../utils/idle-farm-command-listener';
import {messageChecker} from '../../../idle-farm/message-checker';
import type {IUser} from '@idle-helper/models';

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
  const userAccount = await userService.findUser({
    userId: author.id
  });
  if (!userAccount) return;

  await generateAndSendEmbed({
    author,
    client,
    message,
    userAccount
  });
  let event = createIdleFarmCommandListener({
    author,
    client,
    channelId: message.channel.id
  });
  if (!event) return;
  event.on('embed', (embed, collected) => {
    if (messageChecker.claim.isBoosted({embed, author})) {
      generateAndSendEmbed({
        author,
        client,
        message: collected,
        userAccount
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
};

interface IGenerateAndSendEmbed extends IClaimCalculator {
  userAccount: IUser;
}

const generateAndSendEmbed = async ({
  author,
  client,
  message,
  userAccount
}: IGenerateAndSendEmbed) => {
  const items = messageReaders.claim({
    embed: message.embeds[0]
  });

  const marketItems = await infoService.getMarketItems();
  const {getMessageOptions, replyInteraction} = generateIdlonsEmbed({
    marketItems,
    author,
    user: userAccount,
    title: 'Claim Calculator'
  });
  const event = await djsMessageHelper.interactiveSend({
    options: getMessageOptions(items),
    client,
    channelId: message.channel.id
  });
  if (!event) return;
  event.every(interaction => {
    return replyInteraction(interaction, items);
  });
};
