import {djsMessageHelper} from '../../../discordjs/message';
import type {Client, Message} from 'discord.js';
import { EmbedBuilder} from 'discord.js';
import type {IUser} from '@idle-helper/models';
import messageReaders from '../../../idle-farm/message-readers';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';
import {calcWorkerPower} from '../../../idle-farm/calculator/worker-power';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';
import {calcWorkerDmg} from '../../../idle-farm/calculator/calcWorkerDmg';

interface IPlayerRaidGuide {
  message: Message;
  userAccount: IUser;
  client: Client;
}

export const _playerRaidGuide = async ({
  userAccount,
  client,
  message
}: IPlayerRaidGuide) => {
  const channelId = message.channelId;
  const userWorkers = userAccount.workers;
  const registeredWorkersAmount =
    Object.values(userWorkers).filter(Boolean).length;
  if (!registeredWorkersAmount) {
    return djsMessageHelper.send({
      client,
      channelId,
      options: {
        content: 'You may need to register your workers to use raid helper'
      }
    });
  }

  const userWorker = userAccount.workers;
  const raidMessage = message;

  const guideEmbed = generateEmbed({
    userWorkers: userWorker,
    raidMessage
  });
  const sentMessage = await djsMessageHelper.send({
    client,
    channelId,
    options: {
      embeds: [guideEmbed]
    }
  });
  if (!sentMessage) return;
  const event = await createMessageEditedListener({
    messageId: raidMessage.id
  });
  event.on(raidMessage.id, async (message) => {
    const guideEmbed = generateEmbed({
      userWorkers: userWorker,
      raidMessage: message
    });
    await djsMessageHelper.edit({
      client,
      message: sentMessage,
      options: {
        embeds: [guideEmbed]
      }
    });
  });
};

interface IGenerateEmbed {
  raidMessage: Message;
  userWorkers: IUser['workers'];
}

const generateEmbed = ({userWorkers, raidMessage}: IGenerateEmbed) => {
  const raidInfo = messageReaders.raid({message: raidMessage});
  const {enemyFarms, workers} = raidInfo;
  const currentEnemy = enemyFarms.find((farm) => farm.health);
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);
  const workersInfo: string[] = [];
  for (const {type} of workers) {
    const workerInfo = userWorkers[type];
    if (!workerInfo) continue;
    const power = calcWorkerPower({
      type,
      level: workerInfo.level,
      decimalPlace: 2
    });
    const enemyPower = currentEnemy?.worker
      ? calcWorkerPower({
        type: currentEnemy.worker,
        decimalPlace: 2,
        level: currentEnemy.level
      })
      : null;
    const damage = enemyPower
      ? calcWorkerDmg({
        type: 'player',
        atk: power,
        def: enemyPower
      })
      : '-';
    const value = `${BOT_EMOJI.worker[type]} Lv ${workerInfo.level} | AT: ${power} | DMG: ${damage}`;
    const isWorkerUsed = workers.find((w) => w.type === type)?.used;
    workersInfo.push(isWorkerUsed ? `~~${value}~~` : value);
  }
  embed.addFields({
    name: `${BOT_EMOJI.other.farm} Your farms`,
    value: workersInfo.join('\n'),
    inline: true
  });

  const enemyFarmsInfo: string[] = [];
  for (const farm of enemyFarms) {
    const isCurrentEnemy = farm.worker === currentEnemy?.worker;
    const {worker, level, health} = farm;
    const power = worker
      ? calcWorkerPower({
        type: worker,
        level,
        decimalPlace: 2
      })
      : 0;
    const value = `${
      worker ? BOT_EMOJI.worker[worker] : '??'
    }Lv ${level} | AT: ${power}`;
    enemyFarmsInfo.push(
      health ? (isCurrentEnemy ? `**${value}**` : value) : `~~${value}~~`
    );
  }
  embed.addFields({
    name: `${BOT_EMOJI.other.farm} Enemy farms`,
    value: enemyFarmsInfo?.length
      ? enemyFarmsInfo.join('\n')
      : 'No workers found',
    inline: true
  });
  return embed;
};
