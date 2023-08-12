import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {idleDaily} from '../../../../lib/idle-farm/progress/daily';

export default <PrefixCommand>{
  name: 'idleDaily',
  commands: ['daily'],
  type: PREFIX_COMMAND_TYPE.idleFarm,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    idleDaily({
      client,
      message,
      author: message.author,
      isSlashCommand: false,
    });
  },
};
