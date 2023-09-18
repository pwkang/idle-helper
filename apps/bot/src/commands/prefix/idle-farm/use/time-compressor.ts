import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import {idleUseTimeCompressor} from '../../../../lib/idle-farm/use/time-compressor';

export default <PrefixCommand>{
  name: 'idleTimeCompressor',
  commands: ['use time compressor'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
  },
  type: PREFIX_COMMAND_TYPE.idleFarm,
  execute: (client, message) => {
    idleUseTimeCompressor({
      author: message.author,
      client,
      isSlashCommand: false,
      message,
    });
  },
};