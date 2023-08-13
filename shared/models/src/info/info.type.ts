import {ValuesOf} from '../type';
import {IDLE_FARM_ITEMS, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';

export interface IMarketItem {
  price: number;
  isOverstocked: boolean;
  lastUpdatedAt: Date;
}

export type TMarketItems = Record<keyof typeof IDLE_FARM_ITEMS, IMarketItem>;

export interface IInfo {
  workerPower: Record<ValuesOf<typeof IDLE_FARM_WORKER_TYPE>, Record<number, number>>;
  market: TMarketItems;
}
