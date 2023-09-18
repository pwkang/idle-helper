import commandHelper from '../../command-helper';
import messageFormatter from '../../../discordjs/message-formatter';
import convertMsToHumanReadableString from '../../../../utils/convert-ms-to-human-readable-string';
import {djsMessageHelper} from '../../../discordjs/message';
import claimReminder from '../claim-reminder';
import {ReminderReady} from './type';

export const _claimReminderReady = async ({userAccount, channelId, client}: ReminderReady) => {
  const idleDuration = commandHelper.calculator.idleDuration(userAccount);
  const content = `${messageFormatter.user(
    userAccount.userId,
  )}, You have been idle for **${convertMsToHumanReadableString(idleDuration)}**`;

  await djsMessageHelper.send({
    client,

    channelId,
    options: {
      content,
    },
  });

  await claimReminder.update({
    userId: userAccount.userId,
  });

};
