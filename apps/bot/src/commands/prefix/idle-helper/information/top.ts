import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'leaderboard',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['top'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, message) => {
    let leaderboard = await commandHelper.leaderboard.show();
    const event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: leaderboard.render(),
      onEnd: () => {
        leaderboard = null as any;
      },
    });
    if (!event) return;
    event.every((interaction) => {
      return leaderboard.replyInteraction(interaction);
    });
  },
};
