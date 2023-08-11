import {IGuild} from './guild.type';
import {Schema} from 'mongoose';

export const guildSchema = new Schema<IGuild>({
  serverId: {
    type: String,
    required: true,
  },
  roleId: String,
  leaderId: String,
  toggle: {
    teamRaid: {
      reminder: {type: Boolean, default: true},
    },
  },
  info: {
    name: String,
  },
  teamRaid: {
    readyAt: Date,
    channelId: String,
    message: String,
  },
  members: [String],
});
