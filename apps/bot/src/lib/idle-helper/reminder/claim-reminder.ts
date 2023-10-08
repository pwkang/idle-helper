import type {Client} from 'discord.js';
import {userService} from '../../../services/database/user.service';
import ms from 'ms';
import {djsMessageHelper} from '../../discordjs/message';
import convertMsToHumanReadableString from '../../../utils/convert-ms-to-human-readable-string';
import messageFormatter from '../../discordjs/message-formatter';
import toggleUserChecker from '../toggle-checker/user';
import commandHelper from '../command-helper';
import {userReminderServices} from '../../../services/database/user-reminder.service';

interface ISendReminder {
  userId: string;
  client: Client;
}

const sendReminder = async ({client, userId}: ISendReminder) => {
  const userAccount = await userService.findUser({
    userId
  });
  if (!userAccount?.farms.lastClaimedAt) return;

  const userToggle = await toggleUserChecker({userId});
  if (!userToggle?.reminder.claim) return;

  const idleDuration = commandHelper.calculator.idleDuration(userAccount);
  await djsMessageHelper.send({
    client,
    channelId: userAccount.config.channelId,
    options: {
      content: `${messageFormatter.user(
        userId
      )}, You have been idle for **${convertMsToHumanReadableString(
        idleDuration
      )}**`
    }
  });
  await updateReminder({
    userId
  });
};

interface IUpdateReminder {
  userId: string;
}

const updateReminder = async ({userId}: IUpdateReminder) => {
  const userAccount = await userService.findUser({
    userId
  });
  if (!userAccount?.farms.lastClaimedAt) return;

  const workedDuration = commandHelper.calculator.idleDuration(userAccount);

  const nextReminderTime = Math.min(
    ...userAccount.farms.reminderHours.filter(
      (h) => ms(`${h}h`) > workedDuration
    )
  );
  if (nextReminderTime === Infinity) return;
  const remindAt = new Date(
    userAccount.farms.lastClaimedAt.getTime() + ms(`${nextReminderTime}h`)
  );
  await userReminderServices.saveUserClaimCooldown({
    userId,
    readyAt: remindAt
  });
};

const claimReminder = {
  send: sendReminder,
  update: updateReminder
};

export default claimReminder;
