import {ButtonComponent, Message} from 'discord.js';
import {IDLE_FARM_FARM_TYPE, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface IEnemyWorker {
  type: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
  level: number;
  hp: number;
  maxHp: number;
  farm: ValuesOf<typeof IDLE_FARM_FARM_TYPE>;
}

interface IMemberWorker {
  type: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
  used: boolean;
}

interface IPlayer {
  username: string;
  workers: IMemberWorker[];
}

export const _teamRaidReader = (message: Message) => {
  const embed = message.embeds[0];
  const components = message.components;
  const enemyGuild = embed.description?.match(/You are raiding \*\*(.*)\*\*/)?.[1];
  const enemies: IEnemyWorker[][] = [];
  for (const field of embed.fields) {
    if (!isEnemyField(field.name, enemyGuild)) continue;
    const workers: IEnemyWorker[] = [];
    const rows = field.value.split('\n');
    for (const row of rows) {
      const hp = row.match(/`(\d+)\/\d+`/)?.[1];
      const maxHp = row.match(/`\d+\/(\d+)`/)?.[1];
      const level = row.match(/Lv(\d+)/)?.[1];
      const type = typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(([, value]) => row.includes(value))?.[0];
      const farm = typedObjectEntries(IDLE_FARM_FARM_TYPE).find(([, value]) => row.includes(value))?.[1];
      workers.push({
        type: type!,
        level: level ? Number(level) : 0,
        maxHp: maxHp ? Number(maxHp) : 0,
        hp: hp ? Number(hp) : 0,
        farm: farm!,
      });
    }
    enemies.push(workers);
  }

  const members: IPlayer[] = [];
  for (const row of components) {
    for (const button of row.components) {
      if (!(button instanceof ButtonComponent)) continue;
      const type = typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(([, value]) => button.emoji?.name === `${value}worker`)?.[0];
      const username = button.label!;
      const used = button.disabled;
      const member = members.find(member => member.username === username);
      if (member) {
        member.workers.push({
          type: type!,
          used,
        });
      } else {
        members.push({
          username,
          workers: [{
            type: type!,
            used,
          }],
        });
      }

    }
  }

  return {enemyGuild: enemyGuild!, enemies, members};
};

const isEnemyField = (fieldName: string, enemyGuild?: string) =>
  (enemyGuild && fieldName.includes(enemyGuild)) || fieldName === '';
