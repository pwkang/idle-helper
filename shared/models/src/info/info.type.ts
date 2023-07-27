import {ValuesOf} from '../type';
import {IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';

export interface IInfo {
  workerPower: Record<ValuesOf<typeof IDLE_FARM_WORKER_TYPE>, Record<number, number>>;
}
