import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {leaderboard} from '../../../lib/idle-helper/leaderboard';
import {djsMessageHelper} from '../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'updateLeaderboard',
  commands: ['update top'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    await leaderboard.workers();
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {
        content: 'Leaderboard updated!',
      },
    });
  },
};
