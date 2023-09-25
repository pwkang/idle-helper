import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, Message} from 'discord.js';
import {IUser, IUserWorker} from '@idle-helper/models';
import {djsMessageHelper} from '../../../discordjs/message';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';
import messageReaders from '../../../idle-farm/message-readers';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {calcWorkerPower} from '../../../idle-farm/calculator/worker-power';
import {calcWorkerDmg} from '../../../idle-farm/calculator/calcWorkerDmg';

interface IRaidHelper {
  message: Message;
  userAccount: IUser;
  client: Client;
}

export const _playerRaidHelper = async ({message, userAccount, client}: IRaidHelper) => {
  const channelId = message.channelId;
  const userWorkers = userAccount.workers;
  const registeredWorkersAmount = Object.values(userWorkers).filter(Boolean).length;
  if (!registeredWorkersAmount) {
    return djsMessageHelper.send({
      client,
      channelId,
      options: {
        content: 'You may need to register your workers to use raid helper',
      },
    });
  }

  let raidInfo = messageReaders.raid({message});
  let prevWorkers = [...raidInfo.workers];

  let solution = generateBruteForceSolution({
    enemies: raidInfo.enemyFarms.map((enemy) => ({
      level: enemy.level,
      type: enemy.worker,
      hp: enemy.health,
    })),
    workers: raidInfo.workers
      .filter(worker => !worker.used)
      .map((worker) => userWorkers[worker.type]),
  });

  let shouldSelect = solution.solution.filter(type =>
    raidInfo.workers.find(worker => worker.type === type && !worker.used),
  )[0];
  const guideEmbed = generateEmbed({
    solution,
  });
  const components = generateComponents({
    raidInfo,
    solution,
  });
  const sentMessage = await djsMessageHelper.send({
    client,
    channelId,
    options: {
      embeds: [guideEmbed],
      components,
    },
  });
  if (!sentMessage) return;
  const event = await createMessageEditedListener({
    messageId: message.id,
  });
  event.on(message.id, async (collected) => {
    raidInfo = messageReaders.raid({message: collected});
    const selectedWorker = raidInfo.workers.find(worker =>
      worker.used
      && !prevWorkers.find(prevWorker => prevWorker.type === worker.type)?.used);

    if (shouldSelect !== selectedWorker?.type) {
      solution = generateBruteForceSolution({
        enemies: raidInfo.enemyFarms.map((enemy) => ({
          level: enemy.level,
          type: enemy.worker,
          hp: enemy.health,
        })),
        workers: raidInfo.workers
          .filter(worker => !worker.used)
          .map((worker) => userWorkers[worker.type]),
      });
    }
    prevWorkers = [...raidInfo.workers];
    shouldSelect = solution.solution.filter(type =>
      raidInfo.workers.find(worker => worker.type === type && !worker.used),
    )[0];

    const guideEmbed = generateEmbed({
      solution,
    });
    const components = generateComponents({
      raidInfo,
      solution,
    });
    await djsMessageHelper.edit({
      client,
      message: sentMessage,
      options: {
        embeds: [guideEmbed],
        components,
      },
    });
  });
};


interface IGenerateEmbed {
  solution: ReturnType<typeof generateBruteForceSolution>;
}

export const generateEmbed = ({solution}: IGenerateEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);

  embed.addFields({
    name: 'Attack Logs',
    value: solution.log.join('\n'),
    inline: true,
  });

  embed.setFooter({
    text: `Enemy left: ${solution.workerLeft} | Total Solution: ${solution.solutionCount} `,
  });

  return embed;
};

interface IGenerateComponents {
  raidInfo: ReturnType<typeof messageReaders.raid>;
  solution: ReturnType<typeof generateBruteForceSolution>;
}

export const generateComponents = ({raidInfo, solution}: IGenerateComponents) => {
  const {workers} = raidInfo;

  const nextMove = solution.solution.filter(type =>
    workers.find(worker => worker.type === type && !worker.used),
  )[0];
  const actionRows = [];
  for (let i = 0; i < workers.length; i += 4) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    for (let j = i; j < i + 4; j++) {
      if (!workers[j]) break;
      const isUsed = workers[j].used;
      const solutionIndex = solution.solution.indexOf(workers[j].type);
      const isSolution = solutionIndex !== -1;
      const isNextMove = nextMove === workers[j].type;
      const buttonStyle = isNextMove ? ButtonStyle.Success : ButtonStyle.Secondary;
      const disabled = isUsed || !isNextMove;
      const button = new ButtonBuilder()
        .setCustomId(workers[j].type)
        .setEmoji(BOT_EMOJI.worker[workers[j].type])
        .setLabel(isSolution ? `${solutionIndex + 1}` : '\u200b')
        .setStyle(buttonStyle)
        .setDisabled(disabled);
      row.addComponents(button);
    }
    actionRows.push(row);
  }
  return actionRows;
};

interface EnemyInfo {
  type?: keyof typeof IDLE_FARM_WORKER_TYPE;
  level: number;
  hp: number;
}

interface IGenerateBruteForceSolution {
  workers: IUserWorker[];
  enemies: EnemyInfo[];
}

interface IBestSolution {
  solution: (keyof typeof IDLE_FARM_WORKER_TYPE)[];
  enemyLeft: number;
}

const generateBruteForceSolution = ({workers, enemies}: IGenerateBruteForceSolution) => {
  const possibilities = permute(workers.map((worker) => worker.type), workers.length);
  const bestSolution: IBestSolution = {
    enemyLeft: 6,
    solution: [],
  };
  let solutionCount = 0;
  let log: string[] = [];
  const workersMap = workers.reduce((acc, worker) => {
    acc[worker.type] = worker;
    return acc;
  }, {} as Record<keyof typeof IDLE_FARM_WORKER_TYPE, IUserWorker>);
  for (const possibility of possibilities) {
    const result = startRaid({
      workers: possibility.map((type) => workersMap[type]),
      enemies,
    });
    if (result.enemyLeft < bestSolution.enemyLeft) {
      bestSolution.enemyLeft = result.enemyLeft;
      bestSolution.solution = possibility;
      solutionCount = 1;
      log = result.log;
    }
    if (result.enemyLeft === bestSolution.enemyLeft) {
      solutionCount++;
    }
  }

  return {
    solution: bestSolution.solution,
    workerLeft: bestSolution.enemyLeft,
    solutionCount,
    log,
  };
};


interface IStartRaid {
  workers: IUserWorker[];
  enemies: EnemyInfo[];
}

function startRaid({workers, enemies}: IStartRaid) {
  const _enemies = enemies.map(enemy => ({...enemy}));
  const log = [];
  for (const worker of workers) {
    const enemy = {..._enemies[0]};
    const enemyPower = enemy.type ? calcWorkerPower({
      type: enemy.type,
      level: enemy.level,
    }) : 0;
    const workerPower = calcWorkerPower({
      type: worker.type,
      level: worker.level,
    });
    const damage = calcWorkerDmg({
      type: 'player',
      def: enemyPower,
      atk: workerPower,
    });
    _enemies[0].hp -= damage;
    if (_enemies[0].hp <= 0) {
      log.push(`${BOT_EMOJI.worker[worker.type]} ⚔️ ${enemy.type ? BOT_EMOJI.worker[enemy.type] : '??'} | 💀`);
      _enemies.shift();
    } else {
      log.push(`${BOT_EMOJI.worker[worker.type]} ⚔️ ${enemy.type ? BOT_EMOJI.worker[enemy.type] : '??'} | ${_enemies[0].hp} / ${enemy.hp} ❤️`);
    }
  }
  return {
    enemyLeft: _enemies.length,
    log,
  };
}


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function permute<T>(arr: T[], length: number): T[][] {
  // Base case: if the length is 0, return an array with an empty array
  if (length === 0) {
    return [[]];
  }

  // Initialize an empty array to store permutations
  const permutations = [];

  // Iterate over each element in the array
  for (let i = 0; i < arr.length; i++) {
    // Create a new array consisting of all elements of the original array except for the current element
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));

    // Recursively generate permutations of the remaining elements with a reduced length
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const restPermutations = permute(rest, length - 1);

    // Add the current element to the beginning of each permutation of the remaining elements
    for (let j = 0; j < restPermutations.length; j++) {
      permutations.push([arr[i], ...restPermutations[j]]);
    }
  }

  return permutations;
}

