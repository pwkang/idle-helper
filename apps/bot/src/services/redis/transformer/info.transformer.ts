import {IInfo} from '@idle-helper/models/dist/info/info.type';

const transformWorkerPower = (workerPower?: Record<string, number>) => {
  if (workerPower === undefined) return {};
  const power: Record<string, number> = {};
  for (const [key, value] of Object.entries(workerPower)) {
    power[key] = Number(value);
  }
  return power;
};

const fromRedis = (value: string): IInfo => {
  const parsed = JSON.parse(value) as IInfo;
  return {
    workerPower: {
      common: transformWorkerPower(parsed?.workerPower?.common),
      useless: transformWorkerPower(parsed?.workerPower?.useless),
      wise: transformWorkerPower(parsed?.workerPower?.wise),
      expert: transformWorkerPower(parsed?.workerPower?.expert),
      talented: transformWorkerPower(parsed?.workerPower?.talented),
      masterful: transformWorkerPower(parsed?.workerPower?.masterful),
      deficient: transformWorkerPower(parsed?.workerPower?.deficient),
    },
  };
};

const toRedis = (value: IInfo): string => {
  return JSON.stringify(value);
};

export const infoTransformer = {
  fromRedis,
  toRedis,
};
