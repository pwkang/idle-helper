import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {idleGuild} from '../../../../lib/idle-farm/guild/guild';

export default <PrefixCommand>{
  name: 'guild',
  type: PREFIX_COMMAND_TYPE.idleFarm,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commands: ['guild', 'clan'],
  execute: async (client, message) => {
    await idleGuild({
      author: message.author,
      client: client,
      isSlashCommand: false,
      message,
    });
  },
};
