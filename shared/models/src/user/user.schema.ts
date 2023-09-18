import {Schema} from 'mongoose';
import {IUser, IUserWorker} from './user.type';

const workerSchema = new Schema<IUserWorker>({
  level: Number,
  maxExp: Number,
  exp: Number,
  power: Number,
  farm: String,
  type: String,
  amount: Number,
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
      vote: {type: Boolean, default: true},
      daily: {type: Boolean, default: true},
    },
    raidHelper: {type: Boolean, default: true},
    calculator: {
      all: {type: Boolean, default: true},
      claim: {type: Boolean, default: false},
      inventory: {type: Boolean, default: true},
    },
    autoSend: {
      profile: {type: Boolean, default: false},
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
    itemsUsed: {
      timeCompressor: {type: Number, default: 0},
      timeSpeeder: {type: Number, default: 0},
    },
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
  reminder: {
    vote: {
      readyAt: Date,
    },
  },
  lastUpdated: {
    toggle: Date,
    username: Date,
    workers: Date,
    energy: Date,
  },
});
