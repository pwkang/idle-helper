import {Schema} from 'mongoose';
import {IUser, IUserWorker} from './user.type';

const workerSchema = new Schema<IUserWorker>({
  level: Number,
  maxExp: Number,
  exp: Number,
  power: Number,
  farm: String,
});

export const userSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    index: true,
  },
  profile: {
    energy: {type: Number, default: 0},
  },
  toggle: {
    reminder: {
      claim: {type: Boolean, default: true},
    },
    raidHelper: {type: Boolean, default: true},
  },
  username: String,
  workers: {
    useless: workerSchema,
    deficient: workerSchema,
    common: workerSchema,
    talented: workerSchema,
    wise: workerSchema,
    expert: workerSchema,
    masterful: workerSchema,
  },
  farms: {
    lastClaimedAt: Date,
    reminderHours: [Number],
  },
  config: {
    onOff: {type: Boolean, default: true},
    channelId: String,
    donorTier: String,
  },
  commandsLastUsed: {
    daily: Date,
    claim: Date,
  },
});
