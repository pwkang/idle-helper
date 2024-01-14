import type {ReminderReady} from './type';
import {djsMessageHelper} from '../../../discordjs/message';
import messageFormatter from '../../../discordjs/message-formatter';
import toggleUserChecker from '../../toggle-checker/user';

export const _voteReminderReady = async ({
  client,
  channelId,
  userAccount
}: ReminderReady) => {
  const toggleChecker = await toggleUserChecker({
    userId: userAccount.userId
  });

  if (!toggleChecker?.reminder?.vote) return;

  await djsMessageHelper.send({
    client,
    channelId,
    options: {
      content: `${messageFormatter.user(
        userAccount.userId
      )}, **__IDLE VOTE__** is ready!`
    }
  });
};
