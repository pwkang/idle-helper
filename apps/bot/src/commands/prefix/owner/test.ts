import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {idleUseTimeSpeederSuccess} from '../../../lib/idle-farm/use/time-speeder';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const msg = await message.channel.messages.fetch(args[1]);
    if (!msg) return;
    idleUseTimeSpeederSuccess({
      author: message.author,
      message: msg,
    });
  },
};
