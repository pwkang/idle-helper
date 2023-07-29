import {mongoClient} from '@idle-helper/services';
import {infoSchema} from '@idle-helper/models/dist/info/info.schema';
import {IInfo} from '@idle-helper/models/dist/info/info.type';
import {IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {infoRedis} from '../redis/info.redis';

infoSchema.post('findOneAndUpdate', async function(doc) {
  await infoRedis.setInfo(doc);
});

const dbInfo = mongoClient.model<IInfo>('Info', infoSchema);

const getWorkerPower = async (): Promise<IInfo['workerPower']> => {
  const cachedInfo = await infoRedis.getInfo();
  if (!cachedInfo) {
    const info = await dbInfo.findOne();
    info && await infoRedis.setInfo(info);
    return info?.workerPower ?? {} as IInfo['workerPower'];
  }
  return cachedInfo.workerPower;
};

interface IUpdateWorkerPower {
  worker: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
  level: number;
  power: number;
}

const updateWorkerPower = async ({worker, level, power}: IUpdateWorkerPower) => {
  const info = await getWorkerPower();
  if (!info) return;
  const targetWorker = info[worker];
  if (targetWorker?.[level] === power) return;
  await dbInfo.findOneAndUpdate({}, {
    $set: {
      [`workerPower.${worker}.${level}`]: power,
    },
  }, {
    upsert: true,
    new: true,
  });
};

const init = async () => {
  const info = await dbInfo.findOne();
  if (!info) {
    return await dbInfo.create({});
  }
  return info;
};

export const infoService = {
  getWorkerPower,
  updateWorkerPower,
  init,
};