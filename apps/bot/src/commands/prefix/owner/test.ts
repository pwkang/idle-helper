import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {idleRaid} from '../../../lib/idle-farm/progress/raid';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const fetched = await message.channel.messages.fetch('1137298969064636447');
    await idleRaid({
      author: message.author,
      client,
      isSlashCommand: true,
      message: fetched,
    });
  },
};