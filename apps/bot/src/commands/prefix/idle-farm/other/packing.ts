import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {idlePacking} from '../../../../lib/idle-farm/other/packing';

export default <PrefixCommand>{
  name: 'idlePacking',
  type: PREFIX_COMMAND_TYPE.idleFarm,
  commands: ['packing'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message) => {
    idlePacking({
      author: message.author,
      message,
      client,
      isSlashCommand: false
    });
  }
};
