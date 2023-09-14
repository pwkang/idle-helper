import {typedObjectEntries} from '@idle-helper/utils';
import {calcWorkerPower} from '../lib/idle-farm/calculator/worker-power';
import {IUser} from '@idle-helper/models';

export const getTop3Power = (userAccount: IUser) => {
  if (!userAccount.lastUpdated?.workers) return 0;
  const top3Workers = typedObjectEntries(userAccount.workers)
    .map(([type, worker]) => ({
      power: calcWorkerPower({type, level: worker.level, decimalPlace: 3}),
    }))
    .sort((a, b) => b.power - a.power)
    .slice(0, 3);
  return top3Workers.reduce((acc, worker) => acc + worker.power, 0);

};