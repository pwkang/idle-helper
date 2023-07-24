import {Client} from 'discord.js';
import ms from 'ms';
import {redisService} from './redis.service';

const prefix = 'epic-helper:rpg-message-owner:';

interface IRedisSetRpgMessageOwner {
  client: Client;
  userId: string;
  messageId: string;
}

const setOwner = async ({userId, messageId}: IRedisSetRpgMessageOwner) => {
  await redisService.set(`${prefix}${messageId}`, userId, {
    PX: ms('5m'),
  });
};

interface IRedisGetRpgMessageOwner {
  client: Client;
  messageId: string;
}

const getOwner = async ({messageId}: IRedisGetRpgMessageOwner) => {
  return await redisService.get(`${prefix}${messageId}`);
};

export const redisRpgMessageOwner = {
  setOwner,
  getOwner,
};
