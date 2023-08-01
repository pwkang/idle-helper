import {redisService} from './redis.service';

const prefix = 'idle-helper:claim-reminder:';

const setUser = async (userId: string, datetime: Date) => {
  await redisService.set(`${prefix}${userId}`, datetime.getTime());
};

const getReadyUsers = async () => {
  const keys = await redisService.keys(`${prefix}*`);
  const users = await Promise.all(keys.map(async (key) => {
    const userId = key.replace(prefix, '');
    const datetime = await redisService.get(key);
    return {
      userId,
      datetime: new Date(Number(datetime)),
    };
  }));
  return users.filter((user) => user.datetime.getTime() <= Date.now());
};

const removeUser = async (userId: string) => {
  await redisService.del(`${prefix}${userId}`);
};

export const redisClaimReminder = {
  setUser,
  getReadyUsers,
  removeUser,
};