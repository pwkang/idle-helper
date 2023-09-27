import {BaseMessageOptions, EmbedBuilder, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {calcWorkerPower} from '../../../idle-farm/calculator/worker-power';
import {typedObjectEntries} from '@idle-helper/utils';
import {getTop3Power} from '../../../../utils/getTop3Power';

interface IListWorkers {
  author: User;
}

export const _listWorkers = async ({author}: IListWorkers): Promise<BaseMessageOptions | null> => {
  const userAccount = await userService.findUser({userId: author.id});
  if (!userAccount) return null;

  return {
    embeds: [
      getEmbed({
        author,
        userAccount,
      }),
    ],
  };
};

interface IGetEmbed {
  author: User;
  userAccount: IUser;
}

const getEmbed = ({userAccount, author}: IGetEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username} — workers`,
    iconURL: author.avatarURL() ?? undefined,
  });

  const workers: string[] = [];
  if (userAccount.lastUpdated.workers) {

    for (const [workerType] of typedObjectEntries(IDLE_FARM_WORKER_TYPE)) {
      const worker = userAccount.workers[workerType];
      const emoji = BOT_EMOJI.worker[workerType];
      if (worker) {
        workers.push(
          `${emoji} ${BOT_EMOJI.other.level} ${worker.level} :boom: ${calcWorkerPower({
            type: workerType,
            level: worker.level,
            decimalPlace: 2,
          })}`,
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

  embed.setDescription(workers.reverse().join('\n'));
  return embed;
};
