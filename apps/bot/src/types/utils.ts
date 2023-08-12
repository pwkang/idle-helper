import {Embed, Message, User} from 'discord.js';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

export interface IMessageContentChecker {
  message: Message;
  author: User;
}

export interface IMessageEmbedChecker {
  embed: Embed;
  author: User;
}

export interface ICommandPreCheck {
  userNotRegistered?: ValuesOf<typeof USER_NOT_REGISTERED_ACTIONS>;
  userAccOff?: ValuesOf<typeof USER_ACC_OFF_ACTIONS>;
  isServerAdmin?: boolean;
}
