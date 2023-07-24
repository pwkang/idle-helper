import type {Client, ClientEvents, Message, SlashCommandBuilder, User} from 'discord.js';
import {ChatInputCommandInteraction} from 'discord.js';
import type {ScheduleOptions} from 'node-cron';
import {
  PREFIX_COMMAND_TYPE,
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';

declare global {
  export type ValuesOf<T extends Record<string, unknown>> = T[keyof T];

  interface PrefixCommand {
    name: string;
    commands: string[];
    execute: (client: Client, message: Message, args: string[]) => void | Promise<void>;
    preCheck: {
      userNotRegistered?: ValuesOf<typeof USER_NOT_REGISTERED_ACTIONS>;
      userAccOff?: ValuesOf<typeof USER_ACC_OFF_ACTIONS>;
    };
    type: ValuesOf<typeof PREFIX_COMMAND_TYPE>;
  }

  interface SlashCommand<T = ChatInputCommandInteraction> {
    name: string;
    interactionType: T;
    execute: (client: Client, interaction: T) => Promise<void>;
    preCheck: {
      userNotRegistered?: ValuesOf<typeof USER_NOT_REGISTERED_ACTIONS>;
      userAccOff?: ValuesOf<typeof USER_ACC_OFF_ACTIONS>;
    };
    builder: SlashCommandBuilder;
  }

  interface SlashMessage {
    name: string;
    commandName: string[];
    bot: ValuesOf<typeof SLASH_MESSAGE_BOT_TYPE>;
    execute: (client: Client, message: Message, author: User) => Promise<void>;
  }

  interface BotMessage {
    name: string;
    match: (message: Message) => boolean;
    bot: string;
    execute: (client: Client, message: Message) => Promise<void>;
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
    execute: (client: Client) => Promise<void>;
  }
}

export {};
