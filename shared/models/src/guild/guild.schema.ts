import {IGuild} from './guild.type';
import {Schema} from 'mongoose';

export const guildSchema = new Schema<IGuild>({
  serverId: {
    type: String,
    required: true,
  },
  roleId: String,
  leaderId: String,
});
