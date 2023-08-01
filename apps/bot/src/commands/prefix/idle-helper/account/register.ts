import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export default <PrefixCommand>{
  name: 'register',
  commands: ['register'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message) => {
    const messageOptions = await commandHelper.userAccount.register({
      author: message.author,
      channelId: message.channel.id,
    });
    await djsMessageHelper.reply({
      client,
      message,
      options: messageOptions,
    });
  },
};
