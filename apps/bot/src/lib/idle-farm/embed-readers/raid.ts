import {ButtonComponent, Message} from 'discord.js';
import {IDLE_FARM_FARM_TYPE, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface IRaidReader {
  message: Message;
}

interface IEnemyFarmInfo {
  farm: keyof typeof IDLE_FARM_FARM_TYPE;
  worker: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
  level: number;
  maxHealth: number;
  health: number;
}

interface IWorkerInfo {
  type: keyof typeof IDLE_FARM_WORKER_TYPE;
  used: boolean;
}

export const _raidReader = ({message}: IRaidReader) => {
  const embed = message.embeds[0];
  const buttons = message.components.flatMap(component => component.components);
  const enemyFarms: IEnemyFarmInfo[] = [];
  for (let row of embed.fields[0].value.split('\n')) {
    if (isNoWorker(row)) continue;
    const farm = typedObjectEntries(IDLE_FARM_FARM_TYPE).find(([_, value]) => row.includes(value))?.[0]!;
    const worker = typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(([_, value]) => row.includes(value))?.[0]!;
    const level = Number(row.match(/Lv(\d+)/)?.[1]);
    const health = Number(row.match(/`(\d+)\/\d+`$/)?.[1]);
    const maxHealth = Number(row.match(/`\d+\/(\d+)`$/)?.[1]);
    enemyFarms.push({
      farm,
      worker,
      level,
      health,
      maxHealth,
    });
  }
  const workers: IWorkerInfo[] = [];
  for (let button of buttons) {
    if (button instanceof ButtonComponent) {
      const worker = button.data as IButtonComponentData;
      const type = typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(([_, value]) => worker.custom_id.includes(value))?.[0]!;
      const used = worker.disabled;
      workers.push({
        used,
        type,
      });
    }
  }
  return {enemyFarms, workers};
};

const isNoWorker = (row: string) => row.includes('NONE');

interface IButtonComponentData {
  custom_id: string;
  type: number;
  style: number;
  disabled: boolean;
  emoji: {
    id: string;
    name: string;
    animated: boolean;
  };
}