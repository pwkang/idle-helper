import {ValuesOf} from '../type';
import {IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';


export interface IUserToggle extends Record<string, boolean | Record<string, boolean>> {
}

export interface IUserWorker {
  level: number;
  power: number;
  exp: number;
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
