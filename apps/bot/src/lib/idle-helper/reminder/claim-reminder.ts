import {Client} from 'discord.js';
import {userService} from '../../../services/database/user.service';
import ms from 'ms';
import {redisClaimReminder} from '../../../services/redis/claim-reminder.redis';
import {djsMessageHelper} from '../../discordjs/message';
import convertMsToHumanReadableString from '../../../utils/convert-ms-to-human-readable-string';
import messageFormatter from '../../discordjs/message-formatter';

interface ISendReminder {
  userId: string;
  client: Client;
}

const sendReminder = async ({client, userId}: ISendReminder) => {
  const userAccount = await userService.findUser({
    userId,
  });
  if (!userAccount?.farms.lastClaimedAt) return;
  const idleDuration = Date.now() - userAccount.farms.lastClaimedAt.getTime();
  await djsMessageHelper.send({
    client,
    channelId: userAccount.config.channelId,
    options: {
      content: `${messageFormatter.user(userId)}, You have been idle for **${convertMsToHumanReadableString(idleDuration)}**`,
    },
  });
  await updateReminder({
    userId,
  });
};

interface IUpdateReminder {
  userId: string;
}

const updateReminder = async ({userId}: IUpdateReminder) => {
  const userAccount = await userService.findUser({
    userId,
  });
  if (!userAccount?.farms.lastClaimedAt) return;
  const workedDuration = Date.now() - userAccount.farms.lastClaimedAt.getTime();
  const nextReminderTime = Math.min(...userAccount.farms.reminderHours.filter(h => ms(`${h}h`) > workedDuration));
  if (nextReminderTime === Infinity) return;
  const remindAt = new Date(userAccount.farms.lastClaimedAt.getTime() + ms(`${nextReminderTime}h`));
  await redisClaimReminder.setUser(userId, remindAt);
};

const claimReminder = {
  send: sendReminder,
  update: updateReminder,
};

export default claimReminder;