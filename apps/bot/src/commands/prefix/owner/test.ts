import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import messageReaders from '../../../lib/idle-farm/message-readers';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const fetchMessage = await message.channel.messages.fetch(args[1]);
    if (!fetchMessage) return;
    const packingResult = messageReaders.sell(fetchMessage);
    console.log(packingResult);
  },
};
