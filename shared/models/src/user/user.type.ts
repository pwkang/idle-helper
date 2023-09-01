import {ValuesOf} from '../type';
import {IDLE_FARM_DONOR_TIER, IDLE_FARM_FARM_TYPE, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';

export interface IUserToggle extends Record<string, boolean | Record<string, boolean>> {
  reminder: {
    claim: boolean;
  };
  raidHelper: boolean;
  calculator: {
    all: boolean;
    claim: boolean;
    inventory: boolean;
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
  };
  workers: Record<ValuesOf<typeof IDLE_FARM_WORKER_TYPE>, IUserWorker>;
  config: {
    onOff: boolean;
    channelId: string;
    donorTier: ValuesOf<typeof IDLE_FARM_DONOR_TIER>;
  };
  farms: {
    lastClaimedAt: Date;
    reminderHours: number[];
  };
  commandsLastUsed: {
    daily: Date;
    claim: Date;
  };
}
