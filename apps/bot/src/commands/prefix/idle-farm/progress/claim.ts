import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {idleClaim} from '../../../../lib/idle-farm/farms/claim';

export default <PrefixCommand>{
  name: 'idleFarmClaim',
  commands: ['claim', 'cl'],
  type: PREFIX_COMMAND_TYPE.idleFarm,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message) => {
    await idleClaim({
      message,
      author: message.author,
      client,
      isSlashCommand: false
    });
  }
};
