import {redisClaimReminder} from '../services/redis/claim-reminder.redis';
import claimReminder from '../lib/idle-helper/reminder/claim-reminder';

export default <CronJob>{
  name: 'claim-reminder',
  expression: '* * * * * *',
  cronOptions: {},
  execute: async (client) => {
    const readyUsers = await redisClaimReminder.getReadyUsers();
    if (!readyUsers.length) return;
    readyUsers.forEach((user) => {
      redisClaimReminder.removeUser(user.userId);
      claimReminder.send({
        userId: user.userId,
        client,
      });
    });
  },
};
