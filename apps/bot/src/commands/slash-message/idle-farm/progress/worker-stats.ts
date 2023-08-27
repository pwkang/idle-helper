import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {idleWorker} from '../../../../lib/idle-farm/progress/workers';

export default <SlashMessage>{
  name: 'worker-stats',
  bot: SLASH_MESSAGE_BOT_TYPE.idleFarm,
  commandName: ['worker stats'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    await idleWorker({
      author,
      client,
      message,
      isSlashCommand: true,
    });
  },
};
