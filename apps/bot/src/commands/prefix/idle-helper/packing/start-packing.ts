import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export default <PrefixCommand>{
  name: 'packing-guide',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['packing start'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, message, args) => {
    commandHelper.packing.startPacking({
      author: message.author,
      client,
      message,
      args,
    });
  },
};