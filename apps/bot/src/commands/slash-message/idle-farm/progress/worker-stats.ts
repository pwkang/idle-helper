import {SLASH_MESSAGE_BOT_TYPE} from '@idle-helper/constants';
import {idleWorker} from '../../../../lib/idle-farm/progress/workers';

export default <SlashMessage>{
  name: 'worker-stats',
  bot: SLASH_MESSAGE_BOT_TYPE.idleFarm,
  commandName: ['worker stats'],
  execute: async (client, message, author) => {
    idleWorker({
      author,
      client,
      message,
      isSlashCommand: true,
    });
  },
};