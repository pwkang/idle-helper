import type {
  ChatInputCommandInteraction,
  Client,
  ClientEvents,
  Message,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  User
} from 'discord.js';
import type {ScheduleOptions} from 'node-cron';
import type {PREFIX_COMMAND_TYPE, SLASH_MESSAGE_BOT_TYPE} from '@idle-helper/constants';
import type {ICommandPreCheck} from './utils';

declare global {
  interface Array<T> {
    filter(fn: typeof Boolean): Array<Exclude<T, null | undefined | 0 | ''>>;
  }

  export type ValuesOf<T extends Record<string, unknown>> = T[keyof T];

  interface PrefixCommand {
    name: string;
    commands: string[];
    execute: (
      client: Client,
      message: Message<true>,
      args: string[],
    ) => void | Promise<void>;
    preCheck: ICommandPreCheck;
    type: ValuesOf<typeof PREFIX_COMMAND_TYPE>;
  }

  type SlashCommand =
    | SlashCommandRoot
    | SlashCommandSubcommand
    | SlashCommandSubcommandGroup;

  interface SlashCommandBase {
    name: string;
    description: string;
    execute: (
      client: Client,
      interaction: ChatInputCommandInteraction,
    ) => Promise<void>;
    preCheck: ICommandPreCheck;
  }

  interface SlashCommandRoot extends SlashCommandBase {
    type: 'command';
    builder?: (command: SlashCommandBuilder) => SlashCommandBuilder;
  }

  interface SlashCommandSubcommand extends SlashCommandBase {
    type: 'subcommand';
    groupName?: string;
    commandName: string;
    builder?: (
      subcommand: SlashCommandSubcommandBuilder,
    ) => SlashCommandSubcommandBuilder;
  }

  interface SlashCommandSubcommandGroup extends SlashCommandBase {
    type: 'subcommandGroup';
    commandName: string;
  }

  interface SlashMessage {
    name: string;
    commandName: string[];
    bot: ValuesOf<typeof SLASH_MESSAGE_BOT_TYPE>;
    preCheck: ICommandPreCheck;
    execute: (
      client: Client,
      message: Message<true>,
      author: User,
    ) => Promise<void>;
  }

  interface BotMessage {
    name: string;
    match: (message: Message<true>) => boolean;
    bot: string;
    execute: (client: Client, message: Message<true>) => Promise<void>;
  }

  interface BotEvent {
    once: boolean;
    eventName: keyof ClientEvents;
    execute: (client: Client, ...args: any[]) => Promise<void>;
  }

  interface CronJob {
    name: string;
    expression: string;
    disabled?: boolean;
    cronOptions: ScheduleOptions;
    firstClusterOnly?: boolean;
    execute: (client: Client) => Promise<void>;
  }

  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      NODE_ENV: 'development' | 'production';
      BOT_PREFIX: string;
      DEV_PREFIX: string;
      DEVS_ID: string;
      MONGO_URI: string;
      TOTAL_SHARDS: string;
      SENTRY_DSN: string;
      PATREON_CAMPAIGN_ID: string;
      PATREON_ACCESS_TOKEN: string;
      REDIS_URL: string;
      API_PORT: string;
      MONGO_DB_NAME: string;
      WHITELIST_SERVERS: string;
    }
  }
}

export {};
