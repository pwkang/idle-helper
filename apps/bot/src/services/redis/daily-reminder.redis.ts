import {redisService} from './redis.service';
import ms from 'ms';
import {getStartOfToday} from '@idle-helper/utils';

const prefix = 'idle-helper:daily-claimed-at:';

const claim = async (userId: string) => {
  await redisService.set(`${prefix}${userId}`, Date.now(), {
    PX: ms('1d'),
  });
};

const isClaimed = async (userId: string) => {
  const claimedAt = await redisService.get(`${prefix}${userId}`);
  if (!claimedAt) return false;
  const date = new Date(Number(claimedAt));
  const startOfToday = getStartOfToday();
  return date.getTime() >= startOfToday.getTime();
};

export const redisDailyReminder = {
  claim,
  isClaimed,
};