import type {BaseMessageOptions, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import type {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';
import {calcWorkerPower} from '../../../idle-farm/calculator/worker-power';
import {getTop3Power} from '../../../../utils/getTop3Power';
import {getTop3Workers} from '../../../../utils/getTop3Workers';
import {workerCommandsField} from './shared';

interface IListWorkers {
  author: User;
}

export const _top3Workers = async ({
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

interface IGetEmbed {
  author: User;
  userAccount: IUser;
}

const getEmbed = ({userAccount, author}: IGetEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username} — top 3 workers`,
    iconURL: author.avatarURL() ?? undefined
  });

  const workers: string[] = [];
  if (userAccount.lastUpdated.workers) {
    const top3Workers = getTop3Workers(userAccount);
    const totalPower = getTop3Power(userAccount);

    workers.push(`Total power: **${totalPower.toFixed(2)}** :boom:`);
    workers.push('');

    for (const worker of top3Workers) {
      const emoji = BOT_EMOJI.worker[worker.type];
      workers.push(
        `${emoji} ${BOT_EMOJI.other.level} ${
          worker.level
        } :boom: ${calcWorkerPower({
          type: worker.type,
          level: worker.level,
          decimalPlace: 2
        })}`
      );
    }
  } else {
    workers.push('No workers registered');
  }

  embed.setDescription(workers.join('\n'));
  embed.addFields(workerCommandsField);

  return embed;
};
