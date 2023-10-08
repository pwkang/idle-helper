import type {Client} from 'discord.js';
import ms from 'ms';
import {userService} from '../../../../services/database/user.service';
import toggleUserChecker from '../../toggle-checker/user';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {IDLE_FARM_REMINDER_TYPE} from '@idle-helper/constants';
import {_claimReminderReady} from './claim-reminder';
import {_voteReminderReady} from './vote-reminder';

const cmdFunc = {
  [IDLE_FARM_REMINDER_TYPE.claim]: _claimReminderReady,
  [IDLE_FARM_REMINDER_TYPE.vote]: _voteReminderReady
} as const;

export const userReminderTimesUp = async (client: Client, userId: string) => {
  const userAccount = await userService.findUser({
    userId
  });
  if (!userAccount?.config?.onOff) return;

  const toggleChecker = await toggleUserChecker({userId});
  if (!toggleChecker) return;

  const readyCommands = await userReminderServices.findUserReadyCommands(
    userId
  );
  for (const command of readyCommands) {
    if (command.readyAt && Date.now() - command.readyAt.getTime() > ms('5s')) {
      await userReminderServices.updateRemindedCooldowns({
        userId: userAccount.userId,
        types: [command.type]
      });
      continue;
    }

    const channelId = userAccount.config.channelId;
    if (!channelId || !client.channels.cache.has(channelId)) continue;
    if (!toggleChecker.reminder[command.type]) continue;

    cmdFunc[command.type]({
      userAccount,
      client,
      channelId
    });
  }
  await userReminderServices.updateRemindedCooldowns({
    userId: userAccount.userId,
    types: readyCommands.map((cmd) => cmd.type)
  });
};
