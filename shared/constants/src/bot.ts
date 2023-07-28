import * as dotenv from 'dotenv';

dotenv.config();
export const PREFIX = {
  bot: process.env.BOT_PREFIX,
  dev: process.env.DEV_PREFIX,
  idleFarm: 'idle ',
} as const;

export const PREFIX_COMMAND_TYPE = {
  idleFarm: 'idleFarm',
  dev: 'dev',
  bot: 'bot',
} as const;

export const SLASH_MESSAGE_BOT_TYPE = {
  idleFarm: 'idleFarm',
} as const;

export const IDLE_FARM_ID = '1085406806492319784';

export const DEVS_ID = process.env.DEVS_ID?.split(',') ?? [];
