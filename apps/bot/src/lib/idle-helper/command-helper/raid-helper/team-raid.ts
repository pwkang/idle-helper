import {BaseMessageOptions, Client, EmbedBuilder, Message, User} from 'discord.js';
import messageReaders from '../../../idle-farm/message-readers';
import {userService} from '../../../../services/database/user.service';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';
import {IUser} from '@idle-helper/models';
import {djsMessageHelper} from '../../../discordjs/message';
import {calcWorkerPower} from '../../../idle-farm/calculator/worker-power';
import {calcOneShotPower} from '../../../idle-farm/calculator/one-show-power';

interface ITeamRaidHelper {
  users: User[];
  collected: Message;
  client: Client;
  channelId: string;
}

export const _teamRaidHelper = async ({client, channelId, users, collected}: ITeamRaidHelper) => {
  const usersAccount = await userService.getUsersById({
    userIds: users.map(user => user.id),
  });

  const messageOptions = generateMessageOptions({
    message: collected,
    usersAccount,
  });

  await djsMessageHelper.send({
    channelId,
    client,
    options: messageOptions,
  });


};

interface IGenerateMessageOptions {
  message: Message;
  usersAccount: IUser[];
}

const generateMessageOptions = ({message}: IGenerateMessageOptions): BaseMessageOptions => {
  const raidInfo = messageReaders.teamRaid(message);
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle('Team Raid Helper');

  const mappedEnemies = [];
  for (const enemy of raidInfo.enemies) {
    for (const worker of enemy) {
      const enemyPower = calcWorkerPower({
        type: worker.type,
        level: worker.level,
      });
      const stats = `${BOT_EMOJI.worker[worker.type]} Lv ${worker.level} | DEF: ${calcOneShotPower({
        enemyPower,
        enemyHp: worker.maxHp,
        decimalPlace: 3,
        raidType: 'team',
      })}`;
      mappedEnemies.push(worker.hp === 0 ? `~~${stats}~~` : stats);
    }
  }
  embed.addFields({
    name: raidInfo.enemyGuild,
    value: mappedEnemies.join('\n'),
  });

  return {
    embeds: [embed],
  };
};