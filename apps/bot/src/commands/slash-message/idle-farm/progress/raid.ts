import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {idleRaid} from '../../../../lib/idle-farm/progress/raid';

export default <SlashMessage>{
  name: 'raid',
  bot: SLASH_MESSAGE_BOT_TYPE.idleFarm,
  commandName: ['raid'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    await idleRaid({
      author,
      client,
      message,
      isSlashCommand: true,
    });
  },
};
