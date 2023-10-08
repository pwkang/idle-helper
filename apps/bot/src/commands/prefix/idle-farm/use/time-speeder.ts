import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {idleUseTimeSpeeder} from '../../../../lib/idle-farm/use/time-speeder';

export default <PrefixCommand>{
  name: 'idleTimeSpeeder',
  commands: ['use time speeder'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort
  },
  type: PREFIX_COMMAND_TYPE.idleFarm,
  execute: (client, message) => {
    idleUseTimeSpeeder({
      author: message.author,
      client,
      isSlashCommand: false,
      message
    });
  }
};
