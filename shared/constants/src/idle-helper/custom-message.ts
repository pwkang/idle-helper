import {ValuesOf} from '../type';
import {IDLE_FARM_COMMAND_TYPE} from '../idle-farm/bot';

export const BOT_REMINDER_DEFAULT_MESSAGES: Partial<
  Record<ValuesOf<typeof IDLE_FARM_COMMAND_TYPE> | 'all', string>
> = {
  // all: '{user}, **__{cmd_upper}__** {emoji} is ready! {slash}\n{next_reminder}',
} as const;

export const BOT_CUSTOM_MESSAGE_VARIABLES = {} as const;

export const BOT_CUSTOM_MESSAGE_TYPES = {
  all: 'all',
} as const;
