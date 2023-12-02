import type {BaseMessageOptions, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import type {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {calcWorkerPower} from '../../../idle-farm/calculator/worker-power';
import {getTop3Power} from '../../../../utils/getTop3Power';
import {workerCommandsField} from './shared';

interface IListWorkers {
  author: User;
}

export const _listWorkers = async ({
  author
}: IListWorkers): Promise<BaseMessageOptions | null> => {
  const userAccount = await userService.findUser({userId: author.id});
  if (!userAccount) return null;

  return {
    embeds: [
      getEmbed({
        author,
        userAccount
      })
    ]
  };
};

const ORDER = [
  IDLE_FARM_WORKER_TYPE.masterful,
  IDLE_FARM_WORKER_TYPE.expert,
  IDLE_FARM_WORKER_TYPE.wise,
  IDLE_FARM_WORKER_TYPE.talented,
  IDLE_FARM_WORKER_TYPE.common,
  IDLE_FARM_WORKER_TYPE.deficient,
  IDLE_FARM_WORKER_TYPE.useless,
  IDLE_FARM_WORKER_TYPE.spooky,
  IDLE_FARM_WORKER_TYPE.snowy
];

interface IGetEmbed {
  author: User;
  userAccount: IUser;
}

const getEmbed = ({userAccount, author}: IGetEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username} — workers`,
    iconURL: author.avatarURL() ?? undefined
  });

  const workers: string[] = [];
  if (userAccount.lastUpdated.workers) {
    for (const workerType of ORDER) {
      const worker = userAccount.workers[workerType];
      const emoji = BOT_EMOJI.worker[workerType];
      const levelEmoji = BOT_EMOJI.other.level;
      const level = worker?.level ?? 0;
      const power = calcWorkerPower({
        type: workerType,
        level,
        decimalPlace: 2
      });
      if (worker) {
        workers.push(
          `${emoji} ${levelEmoji} ${level} :boom: ${power.toFixed(2)}`
        );
      } else {
        workers.push(`${BOT_EMOJI.worker[workerType]} -`);
      }
    }

    const totalPower = getTop3Power(userAccount);

    workers.push('');
    workers.push(`Total power: **${totalPower.toFixed(2)}** :boom:`);
  } else {
    workers.push('No workers registered');
  }

  embed.setDescription(workers.join('\n'));
  embed.addFields(workerCommandsField);
  return embed;
};
