import {ValuesOf} from '../type';
import {IDLE_FARM_WORKER_TYPE, IDLE_HELPER_FARM_TYPE} from '@idle-helper/constants';


export interface IUserToggle extends Record<string, boolean | Record<string, boolean>> {
}

export interface IUserWorker {
  level: number;
  maxExp: number;
  exp: number;
  power: number;
  farm: keyof typeof IDLE_HELPER_FARM_TYPE;
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
  };
  farms: {
    lastClaimedAt: Date;
  };
  datetime: {
    registerAt: Date;
  };
}