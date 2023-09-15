import {IUser} from '@idle-helper/models';
import {typedObjectEntries} from '@idle-helper/utils';
import {calcWorkerPower} from '../lib/idle-farm/calculator/worker-power';

export const getTop3Workers = (user: IUser) => {
  if (!user.lastUpdated?.workers) return [];
  return typedObjectEntries(user.workers)
    .filter(([, worker]) => worker)
    .map(([type, worker]) => ({
      level: worker.level,
      exp: worker.exp,
      maxExp: worker.maxExp,
      farm: worker.farm,
      type,
      power: calcWorkerPower({type, level: worker.level, decimalPlace: 3}),
    }))
    .sort((a, b) => b.power - a.power)
    .slice(0, 3);
};