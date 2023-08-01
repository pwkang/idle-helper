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
    energy: {
      type: Number,
      default: 0,
    },
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
    onOff: {
      type: Boolean,
      default: true,
    },
  },
  commandsLastUsed: {
    daily: Date,
    claim: Date,
  },
});
