import {IUser} from '@idle-helper/models';
import {Client} from 'discord.js';

export interface ReminderReady {
  userAccount: IUser;
  channelId: string;
  client: Client;
}