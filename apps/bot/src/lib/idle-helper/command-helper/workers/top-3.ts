import {BaseMessageOptions, EmbedBuilder, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';
import {calcWorkerPower} from '../../../idle-farm/calculator/worker-power';

interface IListWorkers {
  author: User;
}

export const _top3Workers = async ({author}: IListWorkers): Promise<BaseMessageOptions | null> => {
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
    name: `${author.username} — top 3 workers`,
    iconURL: author.avatarURL() ?? undefined,
  });

  const workers: string[] = [];
  if (userAccount.lastUpdated.workers) {
    const top3Workers = typedObjectEntries(userAccount.workers)
      .map(([type, worker]) => ({
        level: worker.level,
        exp: worker.exp,
        maxExp: worker.maxExp,
        farm: worker.farm,
        type,
        power: calcWorkerPower({type, level: worker.level, decimalPlace: 3}),
      }))
      .sort((a, b) => b.power - a.power)
      .slice(0, 3);
    const totalPower = top3Workers.reduce((acc, worker) => acc + worker.power, 0);

    workers.push(`Total power: **${totalPower}** :boom:`);
    workers.push('');

    for (const worker of top3Workers) {
      const emoji = BOT_EMOJI.worker[worker.type];
      workers.push(
        `${emoji} ${BOT_EMOJI.other.level} ${worker.level} :boom: ${calcWorkerPower({
          type: worker.type,
          level: worker.level,
          decimalPlace: 2,
        })}`,
      );
    }
  } else {
    workers.push('You have not register your workers yet.');
  }

  embed.setDescription(workers.join('\n'));
  return embed;
};
