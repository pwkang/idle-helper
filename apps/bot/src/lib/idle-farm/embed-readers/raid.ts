import {Embed} from 'discord.js';
import {IDLE_FARM_FARM_TYPE, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface IRaidReader {
  embed: Embed;
}

interface IEnemyFarmInfo {
  farm: keyof typeof IDLE_FARM_FARM_TYPE;
  worker: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
  level: number;
  maxHealth: number;
  health: number;
}

export const _raidReader = ({embed}: IRaidReader) => {
  const farms: IEnemyFarmInfo[] = [];
  for (let row of embed.fields[0].value.split('\n')) {
    if (isNoWorker(row)) continue;
    const farm = typedObjectEntries(IDLE_FARM_FARM_TYPE).find(([_, value]) => row.includes(value))?.[0]!;
    const worker = typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(([_, value]) => row.includes(value))?.[0]!;
    const level = Number(row.match(/Lv(\d+)/)?.[1]);
    const health = Number(row.match(/`(\d+)\/\d+`$/)?.[1]);
    const maxHealth = Number(row.match(/`\d+\/(\d+)`$/)?.[1]);
    farms.push({
      farm,
      worker,
      level,
      health,
      maxHealth,
    });
  }
  return farms;
};

const isNoWorker = (row: string) => row.includes('NONE');