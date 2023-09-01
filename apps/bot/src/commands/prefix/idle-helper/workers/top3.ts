import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'workersTop3',
  commands: ['workers top', 'worker top', 'wo top'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const messageOptions = await commandHelper.workers.top3({
      author: message.author,
    });
    if (!messageOptions) return;
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: messageOptions,
    });
  },
};