import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {idleInventory} from '../../../../lib/idle-farm/account/inventory';

export default <PrefixCommand>{
  name: 'idleInventory',
  type: PREFIX_COMMAND_TYPE.idleFarm,
  commands: ['inventory', 'inv', 'i'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip
  },
  execute: async (client, message, args) => {
    idleInventory({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
      isCalc: ['calc', 'c'].some(
        (keyword) => keyword === args[1]?.toLowerCase()
      )
    });
  }
};
