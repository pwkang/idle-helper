import {redisService} from '../../services/redis/redis.service';

export const loadRedis = async () => {
  await redisService.connect();
};
