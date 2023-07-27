import {mongoClient} from '@idle-helper/services';
import {infoSchema} from '@idle-helper/models/dist/info/info.schema';
import {IInfo} from '@idle-helper/models/dist/info/info.type';
import {IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';

const dbInfo = mongoClient.model<IInfo>('Info', infoSchema);

const getWorkerPower = async (): Promise<IInfo['workerPower']> => {
  const info = await dbInfo.findOne();
  return info?.workerPower ?? {} as IInfo['workerPower'];
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