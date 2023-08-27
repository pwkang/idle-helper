import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {idleMarket} from '../../../../lib/idle-farm/other/market';

export default <PrefixCommand>{
  name: 'idleMarket',
  type: PREFIX_COMMAND_TYPE.idleFarm,
  commands: ['market', 'ma'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message) => {
    idleMarket({
      author: message.author,
      client,
      isSlashCommand: false,
      message,
    });
  },
};
