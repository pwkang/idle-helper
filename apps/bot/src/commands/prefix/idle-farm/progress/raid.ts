import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {idleRaid} from '../../../../lib/idle-farm/progress/raid';

export default <PrefixCommand>{
  name: 'idleFarmRaid',
  commands: ['raid'],
  type: PREFIX_COMMAND_TYPE.idleFarm,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    await idleRaid({
      message,
      author: message.author,
      client,
      isSlashCommand: false,
    });
  },
};
