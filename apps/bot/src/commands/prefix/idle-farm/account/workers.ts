import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import {idleWorker} from '../../../../lib/idle-farm/progress/workers';

export default <PrefixCommand>{
  name: 'idleWorkers',
  commands: ['workers', 'worker', 'wo'],
  type: PREFIX_COMMAND_TYPE.idleFarm,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
  },
  execute: async (client, message) => {
    idleWorker({
      message,
      author: message.author,
      client,
      isSlashCommand: false,
    });
  },
};
