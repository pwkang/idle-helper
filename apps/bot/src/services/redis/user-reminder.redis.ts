import {redisService} from './redis.service';

const prefix = 'idle-helper:user-reminder:';

interface IRedisUserReminder {
  userId: string;
  readyAt: Date;
}

const setReminderTime: (userId: string, readyAt: Date) => Promise<void> = async (
  userId,
  readyAt,
) => {
  const data: IRedisUserReminder = {
    readyAt,
    userId,
  };
  await redisService.set(`${prefix}${userId}`, JSON.stringify(data));
};

const getReminderTime: () => Promise<string[]> = async () => {
  const keys = await redisService.keys(`${prefix}*`);
  const usersId = await Promise.all(
    keys.map(async (key) => {
      const data = await redisService.get(key);
      if (!data) return '';
      const {readyAt, userId} = JSON.parse(data) as IRedisUserReminder;
      if (new Date(readyAt) > new Date()) return '';
      await redisService.del(key);
      return userId;
    }),
  );
  return usersId.filter((id) => id !== '');
};

const deleteReminderTime: (userId: string) => Promise<void> = async (userId) => {
  await redisService.del(`${prefix}${userId}`);
};

export const redisUserReminder = {
  setReminderTime,
  getReminderTime,
  deleteReminderTime,
};
