import type {Client} from 'discord.js';
import {redisDailyReminder} from '../../../services/redis/daily-reminder.redis';
import {djsMessageHelper} from '../../discordjs/message';
import messageFormatter from '../../discordjs/message-formatter';
import {IDLE_FARM_CLICKABLE_SLASH_COMMANDS} from '@idle-helper/constants';
import toggleUserChecker from '../toggle-checker/user';

interface IDailyReminder {
  userId: string;
  channelId: string;
  client: Client;
}

export const dailyReminder = async ({
  client,
  channelId,
  userId
}: IDailyReminder) => {

  const toggleChecker = await toggleUserChecker({
    userId
  });

  if (!toggleChecker?.reminder?.daily) return;

  const isClaimed = await redisDailyReminder.isClaimed(userId);
  if (isClaimed) return;
  await djsMessageHelper.send({
    channelId,
    client,
    options: {
      content: `${messageFormatter.user(userId)}, remember to claim your ${
        IDLE_FARM_CLICKABLE_SLASH_COMMANDS.daily
      } reward!`
    }
  });
  await redisDailyReminder.claim(userId);
};
