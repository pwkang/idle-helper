import {redisService} from './redis.service';

const PREFIX = 'idle-helper:help-commands-group';

const get = async () => {
  const data = await redisService.get(PREFIX);
  return data ? JSON.parse(data) : null;
};

const set = async (data: any) => {
  await redisService.set(PREFIX, JSON.stringify(data));
};

const del = async () => {
  await redisService.del(PREFIX);
};

export const redisHelpCommandsGroup = {
  get,
  set,
  del
};
