import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export default <PrefixCommand>{
  name: 'workersAssign',
  commands: ['workers assign', 'worker assign', 'wo assign'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister
  },
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    commandHelper.workers.assign({
      author: message.author,
      message,
      client
    });
  }
};
