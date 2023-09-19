import {BaseMessageOptions, Client, EmbedBuilder, Message, User} from 'discord.js';
import messageReaders from '../../../idle-farm/message-readers';
import {userService} from '../../../../services/database/user.service';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';
import {IUser} from '@idle-helper/models';
import {djsMessageHelper} from '../../../discordjs/message';
import {calcWorkerPower} from '../../../idle-farm/calculator/worker-power';
import {calcOneShotPower} from '../../../idle-farm/calculator/one-show-power';
import {calcWorkerDmg} from '../../../idle-farm/calculator/calcWorkerDmg';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';
import timestampHelper from '../../../discordjs/timestamp';
import ms from 'ms';

const TEAM_RAID_DURATION = ms('5m');

interface ITeamRaidHelper {
  users: User[];
  collected: Message;
  client: Client;
  channelId: string;
}

export const _teamRaidHelper = async ({client, channelId, users, collected}: ITeamRaidHelper) => {
  const usersAccount = await userService.getUsersById({
    userIds: users.map((user) => user.id),
  });
  const startTime = new Date();

  const messageOptions = generateMessageOptions({
    message: collected,
    usersAccount,
    startTime,
  });

  const sentMessage = await djsMessageHelper.send({
    channelId,
    client,
    options: messageOptions,
  });
  if (!sentMessage) return;
  const event = await createMessageEditedListener({
    messageId: collected.id,
  });
  if (!event) return;
  event.on(collected.id, (newMessage) => {
    const messageOptions = generateMessageOptions({
      message: newMessage,
      usersAccount,
      startTime,
    });
    djsMessageHelper.edit({
      client,
      message: sentMessage,
      options: messageOptions,
    });
  });
};

interface IGenerateMessageOptions {
  message: Message;
  usersAccount: IUser[];
  startTime: Date;
}

const generateMessageOptions = ({
  message,
  usersAccount,
  startTime,
}: IGenerateMessageOptions): BaseMessageOptions => {
  const raidInfo = messageReaders.teamRaid(message);
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setTitle('Team Raid Helper');
  const currentEnemy = raidInfo.enemies
    .flatMap((enemy) => enemy.flatMap((worker) => worker))
    .find((worker) => worker.hp > 0);

  const mappedEnemies = [];
  for (const enemy of raidInfo.enemies) {
    for (const worker of enemy) {
      const enemyPower = calcWorkerPower({
        type: worker.type,
        level: worker.level,
      });
      const stats = `${BOT_EMOJI.worker[worker.type]} | DEF: ${calcOneShotPower({
        enemyPower,
        enemyHp: worker.maxHp,
        decimalPlace: 3,
        raidType: 'team',
      })}`;
      mappedEnemies.push(worker.hp === 0 ? `~~${stats}~~` : stats);
    }
  }
  if (mappedEnemies.length)
    embed.addFields({
      name: raidInfo.enemyGuild,
      value: mappedEnemies.join('\n'),
    });

  for (const member of raidInfo.members) {
    const user = usersAccount.find((user) => user.username === member.username);
    const workersInfo: string[] = [];
    if (user?.lastUpdated?.workers) {
      for (const workerInfo of member.workers) {
        const worker = user.workers[workerInfo.type];
        let stats = '';
        if (worker) {
          const workerPower = calcWorkerPower({
            type: workerInfo.type,
            level: worker.level,
            decimalPlace: 3,
          });
          const enemyPower = currentEnemy
            ? calcWorkerPower({
              type: currentEnemy.type,
              level: currentEnemy.level,
              decimalPlace: 3,
            })
            : null;
          const damage = enemyPower
            ? calcWorkerDmg({
              def: enemyPower,
              atk: workerPower,
              type: 'team',
            })
            : 0;
          stats = `${BOT_EMOJI.worker[workerInfo.type]} AT: ${workerPower} | DMG: ${damage}`;
        } else {
          stats = `${BOT_EMOJI.worker[workerInfo.type]} ??`;
        }
        workersInfo.push(workerInfo.used ? `~~${stats}~~` : stats);
      }
    }

    if (!workersInfo.length)
      workersInfo.push('No workers registered');


    embed.addFields({
      name: member.username || 'unknown',
      value: workersInfo.join('\n'),
      inline: true,
    });
  }

  embed.setDescription(
    `Timer: ${timestampHelper.relative({time: new Date(startTime.getTime() + TEAM_RAID_DURATION)})}`,
  );

  return {
    embeds: [embed],
  };
};
