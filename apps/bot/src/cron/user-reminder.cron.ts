import {redisUserReminder} from '../services/redis/user-reminder.redis';
import {redisService} from '../services/redis/redis.service';
import {userReminderTimesUp} from '../lib/idle-helper/reminder/user-reminder';

export default <CronJob>{
  name: 'user-reminder',
  expression: '* * * * * *',
  execute: async (client) => {
    if (!redisService?.isReady) return;

    const usersId = await redisUserReminder.getReminderTime();
    if (!usersId.length) return;
    usersId.forEach((userId) => {
      userReminderTimesUp(client, userId);
    });
  }
};
