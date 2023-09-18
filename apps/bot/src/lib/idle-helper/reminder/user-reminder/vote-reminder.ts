import {ReminderReady} from './type';
import {djsMessageHelper} from '../../../discordjs/message';
import messageFormatter from '../../../discordjs/message-formatter';


export const _voteReminderReady = async ({client, channelId, userAccount}: ReminderReady) => {
  await djsMessageHelper.send({
    client,
    channelId,
    options: {
      content: `${messageFormatter.user(userAccount.userId)}, **__IDLE VOTE__** is ready!`,
    },
  });
};