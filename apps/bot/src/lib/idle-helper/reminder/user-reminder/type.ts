import type {IUser} from '@idle-helper/models';
import type {Client} from 'discord.js';

export interface ReminderReady {
  userAccount: IUser;
  channelId: string;
  client: Client;
}
