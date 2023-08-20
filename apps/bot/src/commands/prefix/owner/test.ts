import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import messageReaders from '../../../lib/idle-farm/embed-readers';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const fetched = await message.channel.messages.fetch('1142729395186966618');
    const items = messageReaders.claim({
      embed: fetched.embeds[0],
    });
    console.log(items);
  },
};
