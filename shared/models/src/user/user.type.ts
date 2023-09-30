import {ValuesOf} from '../type';
import {
  IDLE_FARM_DONOR_TIER,
  IDLE_FARM_FARM_TYPE,
  IDLE_FARM_ITEMS,
  IDLE_FARM_WORKER_TYPE,
} from '@idle-helper/constants';

export interface IUserToggle extends Record<string, boolean | Record<string, boolean>> {
  reminder: {
    claim: boolean;
    vote: boolean;
    daily: boolean;
  };
  raid: {
    helper: boolean;
    solution: boolean;
    compact: boolean;
  };
  calculator: {
    all: boolean;
    claim: boolean;
    inventory: boolean;
  };
  autoSend: {
    profile: boolean;
  };
}

export interface IUserWorker {
  type: keyof typeof IDLE_FARM_WORKER_TYPE;
  level: number;
  amount: number;
  maxExp: number;
  exp: number;
  power: number;
  farm: keyof typeof IDLE_FARM_FARM_TYPE;
}

export interface IUser {
  userId: string;
  username: string;
  toggle: IUserToggle;
  profile: {
    energy: number;
    energyMax: number;
    idlons: number;
    idlucks: number;
    idleCoins: number;
  };
  packing: {
    level: number;
    multiplier: number;
  };
  items: Partial<Record<keyof typeof IDLE_FARM_ITEMS, number>>;
  workers: Record<ValuesOf<typeof IDLE_FARM_WORKER_TYPE>, IUserWorker>;
  config: {
    onOff: boolean;
    channelId: string;
    donorTier: ValuesOf<typeof IDLE_FARM_DONOR_TIER>;
  };
  farms: {
    lastClaimedAt: Date;
    reminderHours: number[];
    itemsUsed: {
      timeCompressor: number;
      timeSpeeder: number;
    }
  };
  commandsLastUsed: {
    daily: Date;
    claim: Date;
  };
  reminder: {
    vote: {
      readyAt: Date;
    }
  },
  lastUpdated: {
    toggle: Date;
    username: Date;
    workers: Date;
    energy: Date;
  };
}
