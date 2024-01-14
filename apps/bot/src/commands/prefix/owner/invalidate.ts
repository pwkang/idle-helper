import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {redisHelpCommands, redisHelpCommandsGroup} from '@idle-helper/services';
import {djsMessageHelper} from '../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'invalidate',
  commands: ['invalidate'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    await redisHelpCommands.del();
    await redisHelpCommandsGroup.del();
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {
        content: 'Done'
      }
    });
  }
};
