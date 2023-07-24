import {IUpgraid} from './team-raid.type';
import {Schema} from 'mongoose';

const recordSchema = new Schema<IUpgraid['users'][0]['records'][0]>({
  channelID: String,
  serverId: String,
  commandType: String,
  messageID: String,
  upgraidAt: Date,
});

const userSchema = new Schema<IUpgraid['users'][0]>({
  uId: String,
  records: {
    type: [recordSchema],
  },
});

export const teamRaidSchema = new Schema<IUpgraid>({
  roleId: String,
  serverId: String,
  weekAt: Date,
  users: {
    type: [userSchema],
  },
});
