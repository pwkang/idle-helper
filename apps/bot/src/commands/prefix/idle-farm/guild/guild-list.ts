import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {idleGuildList} from '../../../../lib/idle-farm/guild/guild-list';

export default <PrefixCommand>{
  name: 'guild-list',
  commands: ['guild list', 'clan list'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip
  },
  type: PREFIX_COMMAND_TYPE.idleFarm,
  execute: async (client, message) => {
    idleGuildList({
      author: message.author,
      client,
      isSlashCommand: false,
      message
    });
  }
};
