import type {SchemaDefinition} from 'mongoose';
import {Schema} from 'mongoose';
import type {IUser, IUserWorker} from './user.type';
import {IDLE_FARM_ITEMS} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

const workerSchema = new Schema<IUserWorker>({
  level: Number,
  maxExp: Number,
  exp: Number,
  power: Number,
  farm: String,
  type: String,
  amount: Number
});

export const userSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    index: true
  },
  profile: {
    energy: {type: Number, default: 0},
    energyMax: {type: Number, default: 0},
    idlons: {type: Number, default: 0},
    idlucks: {type: Number, default: 0},
    idleCoins: {type: Number, default: 0},
    league: {type: String}
  },
  items: typedObjectEntries(IDLE_FARM_ITEMS).reduce((acc, [key]) => {
    acc[key] = {
      type: Number,
      default: 0
    };
    return acc;
  }, {} as SchemaDefinition<IUser['items']>),
  packing: {
    level: {type: Number, default: 0},
    multiplier: {type: Number, default: 1}
  },
  toggle: {
    reminder: {
      claim: {type: Boolean, default: true},
      vote: {type: Boolean, default: true},
      daily: {type: Boolean, default: true}
    },
    raid: {
      helper: {type: Boolean, default: true},
      solution: {type: Boolean, default: true},
      compact: {type: Boolean, default: false}
    },
    calculator: {
      all: {type: Boolean, default: true},
      claim: {type: Boolean, default: false},
      inventory: {type: Boolean, default: true}
    },
    autoSend: {
      profile: {type: Boolean, default: false}
    }
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
    spooky: workerSchema
  },
  farms: {
    lastClaimedAt: Date,
    reminderHours: [Number],
    itemsUsed: {
      timeCompressor: {type: Number, default: 0},
      timeSpeeder: {type: Number, default: 0}
    }
  },
  config: {
    onOff: {type: Boolean, default: true},
    channelId: String,
    donorTier: String
  },
  commandsLastUsed: {
    daily: Date,
    claim: Date
  },
  reminder: {
    vote: {
      readyAt: Date
    }
  },
  lastUpdated: {
    toggle: Date,
    username: Date,
    workers: Date,
    energy: Date
  }
});
