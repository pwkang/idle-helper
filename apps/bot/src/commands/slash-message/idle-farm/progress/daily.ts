import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {idleDaily} from '../../../../lib/idle-farm/progress/daily';

export default <SlashMessage>{
  name: 'daily',
  bot: SLASH_MESSAGE_BOT_TYPE.idleFarm,
  commandName: ['daily'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    await idleDaily({
      author,
      client,
      message,
      isSlashCommand: true,
    });
  },
};
