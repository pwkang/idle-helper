import type {Embed} from 'discord.js';
import {
  IDLE_FARM_FARM_TYPE,
  IDLE_FARM_WORKER_TYPE
} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';
import type {IUserWorker} from '@idle-helper/models';

interface IWorkerReader {
  embed: Embed;
}

export const _workerReader = ({embed}: IWorkerReader) => {
  const workers: IUserWorker[] = [];
  const fields = embed.fields;
  for (const field of fields) {
    const type = typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(([, value]) =>
      field.name.includes(value)
    )?.[0];
    const level = field.value.match(/\*\*Level\*\*: (\d+) /)?.[1] ?? 0;
    const power = field.value.match(/\*\*Power\*\*: (\d+)/)?.[1] ?? 0;
    const farm = typedObjectEntries(IDLE_FARM_FARM_TYPE).find(([, value]) =>
      field.value.includes(value)
    )?.[0];
    const exp = field.value.match(/`\[(\d+)\/\d+]`/)?.[1] ?? 0;
    const maxExp = field.value.match(/`\[\d+\/(\d+)]`/)?.[1] ?? 0;
    const amount = field.value.match(/`\[(\d+)\/\d+]`/)?.[1] ?? 0;
    workers.push({
      type: type!,
      level: Number(level),
      power: Number(power),
      farm: farm!,
      exp: Number(exp),
      maxExp: Number(maxExp),
      amount: Number(amount)
    });
  }
  return workers;
};
