import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'toggleOnOff',
  commands: ['toggle on', 'toggle off', 't on', 't off'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message, args) => {
    const status = args[1] === 'on';
    const userToggle = await commandHelper.toggle.user({
      author: message.author,
    });
    if (!userToggle) return;
    const messageOptions = await userToggle.update({
      on: status ? message.content : undefined,
      off: status ? undefined : message.content,
    });
    if (!messageOptions) return;
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: messageOptions,
    });
  },
};
