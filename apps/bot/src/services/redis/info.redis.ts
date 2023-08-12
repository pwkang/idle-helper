import {redisService} from './redis.service';
import {IInfo} from '@idle-helper/models/dist/info/info.type';
import {infoTransformer} from './transformer/info.transformer';

const prefix = 'idle-helper:info';

const getInfo = async () => {
  const info = await redisService.get(prefix);
  return info ? infoTransformer.fromRedis(info) : null;
};

const setInfo = async (info: IInfo) => {
  await redisService.set(prefix, infoTransformer.toRedis(info));
};

export const infoRedis = {
  getInfo,
  setInfo,
};
