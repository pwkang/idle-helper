import {createClient, RedisClientType} from 'redis';
import * as dotenv from 'dotenv';
import {logger} from '@idle-helper/utils';

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
}) as RedisClientType;

redisClient.on('connect', () => {
  logger({
    message: 'Connecting to Redis',
  });
});

redisClient.on('ready', () => {
  logger({
    message: 'Redis is ready',
  });
});

redisClient.on('reconnecting', () => {
  logger({
    message: 'Redis is reconnecting',
  });
});

redisClient.on('end', () => {
  logger({
    message: 'Redis connection ended',
  });
});

redisClient.on('error', (err: any) => {
  logger({
    message: err.message,
    logLevel: 'error',
  });
});
