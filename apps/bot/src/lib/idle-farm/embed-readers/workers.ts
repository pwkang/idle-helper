import {Embed} from 'discord.js';
import {IDLE_FARM_WORKER_TYPE, IDLE_HELPER_FARM_TYPE} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface IWorkerReader {
  embed: Embed;
}

interface IWorkerInfo {
  type: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
  level: number;
  maxExp: number;
  exp: number;
  power: number;
  farm: keyof typeof IDLE_HELPER_FARM_TYPE;
}

export const _workerReader = ({embed}: IWorkerReader) => {
  const workers: IWorkerInfo[] = [];
  const fields = embed.fields;
  for (const field of fields) {
    const type = typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(([_, value]) => field.name.includes(value))?.[0]!;
    const level = field.value.match(/\*\*Level\*\*: (\d+) /)?.[1] ?? 0;
    const power = field.value.match(/\*\*Power\*\*: (\d+)/)?.[1] ?? 0;
    const farm = typedObjectEntries(IDLE_HELPER_FARM_TYPE).find(([_, value]) => field.value.includes(value))?.[0]!;
    const exp = field.value.match(/`\[(\d+)\/\d+]`/)?.[1] ?? 0;
    const maxExp = field.value.match(/`\[\d+\/(\d+)]`/)?.[1] ?? 0;
    workers.push({
      type,
      level: Number(level),
      power: Number(power),
      farm,
      exp: Number(exp),
      maxExp: Number(maxExp),
    });
  }
  return workers;
};
