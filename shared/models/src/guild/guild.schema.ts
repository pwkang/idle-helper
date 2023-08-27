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
      helper: {type: Boolean, default: true},
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
  membersId: [String],
});
