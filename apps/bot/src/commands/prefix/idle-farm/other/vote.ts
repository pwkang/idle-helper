import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {idleVote} from '../../../../lib/idle-farm/other/vote';

export default <PrefixCommand>{
  name: 'idleVote',
  type: PREFIX_COMMAND_TYPE.idleFarm,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort
  },
  commands: ['vote'],
  execute: async (client, message) => {
    idleVote({
      author: message.author,
      client,
      isSlashCommand: false,
      message
    });
  }
};
