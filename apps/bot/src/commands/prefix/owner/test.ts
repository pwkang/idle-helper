import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const fetched = await message.channel.messages.fetch('1142729395186966618');
    commandHelper.calculator.claim({
      message: fetched,
      client,
      author: message.author,
    });
  },
};
