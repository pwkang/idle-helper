import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {userService} from '../../../../services/database/user.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'toggleReset',
  commands: ['toggle reset', 't reset'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message) => {
    const userToggle = await commandHelper.toggle.user({
      author: message.author,
    });
    if (!userToggle) return;
    const messageOptions = await userToggle.reset();
    if (!messageOptions) return;
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: messageOptions,
    });
  },
};
