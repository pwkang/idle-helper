import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {messageChecker} from '../../../lib/idle-farm/message-checker';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const fetchMessage = await message.channel.messages.fetch(args[1]);
    if (!fetchMessage) return;
    const is = messageChecker.claim.isBoosted({
      author: message.author,
      embed: fetchMessage.embeds[0]
    });
    console.log(is);
  }
};
