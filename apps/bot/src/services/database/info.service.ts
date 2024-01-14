import {mongoClient} from '@idle-helper/services';
import {infoSchema} from '@idle-helper/models/dist/info/info.schema';
import type {IInfo, IMarketItem} from '@idle-helper/models/dist/info/info.type';
import type {IDLE_FARM_ITEMS, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {infoRedis} from '../redis/info.redis';
import ms from 'ms';

infoSchema.post('findOneAndUpdate', async function(doc) {
  if (!doc) return;
  await infoRedis.setInfo(doc);
});

const dbInfo = mongoClient.model<IInfo>('Info', infoSchema);

const getInfo = async () => {
  const cachedInfo = await infoRedis.getInfo();
  if (!cachedInfo) {
    const info = await dbInfo.findOne();
    info && (await infoRedis.setInfo(info));
    return info!;
  }
  return cachedInfo;
};

const getWorkerPower = async (): Promise<IInfo['workerPower']> => {
  const info = await getInfo();
  return info?.workerPower;
};

interface IUpdateWorkerPower {
  worker: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
  level: number;
  power: number;
}

const updateWorkerPower = async ({
  worker,
  level,
  power
}: IUpdateWorkerPower) => {
  const info = await getWorkerPower();
  if (!info) return;
  const targetWorker = info[worker];
  if (targetWorker?.[level] === power) return;
  await dbInfo.findOneAndUpdate(
    {},
    {
      $set: {
        [`workerPower.${worker}.${level}`]: power
      }
    },
    {
      upsert: true,
      new: true
    }
  );
};

const init = async () => {
  const info = await dbInfo.findOne();
  if (!info) {
    return await dbInfo.create({});
  }
  return info;
};

const getMarketItems = async (): Promise<IInfo['market']> => {
  const info = await getInfo();
  return info?.market;
};

interface IUpdateMarketItems extends Omit<IMarketItem, 'lastUpdatedAt'> {
  type: keyof typeof IDLE_FARM_ITEMS;
}

const updateMarketItems = async ({
  type,
  price,
  isOverstocked,
  isOutOfStock,
  rate
}: IUpdateMarketItems) => {
  const marketItems = await getMarketItems();
  const marketItem = marketItems[type];
  if (
    marketItem?.lastUpdatedAt &&
    new Date().getTime() - marketItem?.lastUpdatedAt.getTime() <= ms('5m')
  )
    return;
  await dbInfo.findOneAndUpdate(
    {},
    {
      $set: {
        [`market.${type}`]: {
          price,
          lastUpdatedAt: new Date(),
          isOverstocked,
          isOutOfStock,
          rate
        }
      }
    },
    {
      new: true
    }
  );
};

interface IUpdateLeaderboard {
  type: keyof IInfo['leaderboard'];
  values: Array<{name: string; value: string}>;
}

const updateLeaderboard = async ({type, values}: IUpdateLeaderboard) => {
  await dbInfo.findOneAndUpdate(
    {},
    {
      $set: {
        [`leaderboard.${type}`]: values
      }
    },
    {
      new: true
    }
  );
};

const getLeaderboard = async (): Promise<IInfo['leaderboard']> => {
  const info = await getInfo();
  return info?.leaderboard;
};

export const infoService = {
  getWorkerPower,
  updateWorkerPower,
  init,
  updateMarketItems,
  getMarketItems,
  updateLeaderboard,
  getLeaderboard
};
