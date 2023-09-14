import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

export default <SlashMessage>{
  name: 'guild-stats',
  commandName: ['guild stats'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  bot: SLASH_MESSAGE_BOT_TYPE.idleFarm,
  execute: async () => {
    // await idleGuild({
    //   author,
    //   client,
    //   message,
    //   isSlashCommand: true,
    // });
  },
};
