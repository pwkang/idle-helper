import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import {idleProfile} from '../../../../lib/idle-farm/account/profile';

export default <PrefixCommand>{
  name: 'idleProfile',
  type: PREFIX_COMMAND_TYPE.idleFarm,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
  },
  commands: ['profile', 'p'],
  execute: async (client, message) => {
    idleProfile({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};