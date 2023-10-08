import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {idleTeamRaid} from '../../../../lib/idle-farm/guild/team-raid';

export default <PrefixCommand>{
  name: 'teamRaid',
  type: PREFIX_COMMAND_TYPE.idleFarm,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip
  },
  commands: ['teamRaid'],
  execute: async (client, message) => {
    await idleTeamRaid({
      author: message.author,
      client: client,
      isSlashCommand: false,
      message
    });
  }
};
