import {guildService} from '../../../../services/database/guild.service';
import {BaseInteraction, BaseMessageOptions, Client, EmbedBuilder, Guild} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {IGuild, IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {getTop3Power} from '../../../../utils/getTop3Power';
import {getTop3Workers} from '../../../../utils/getTop3Workers';
import messageFormatter from '../../../discordjs/message-formatter';
import {generateNavigationRow} from '../../../../utils/pagination-row';

const USERS_PER_FIELD = 5;
const USERS_PER_PAGE = 25;


interface ITopPowerListing {
  server: Guild;
  authorId: string;
  client: Client,
}

export const _topPowerListing = async ({authorId}: ITopPowerListing) => {
  const userGuild = await guildService.findUserGuild({
    userId: authorId,
  });

  const users = await userService.getUsersById({
    userIds: userGuild?.membersId ?? [],
  });
  let paginatePage = 0;

  const render = (): BaseMessageOptions => {
    if (!userGuild)
      return {
        content: 'You are not in any guild.',
      };

    return {
      embeds: [
        renderEmbed({
          guild: userGuild,
          users,
          page: paginatePage,
        }),
      ],
      components: [generateNavigationRow({
        total: userGuild?.membersId?.length ?? 0,
        page: paginatePage,
        itemsPerPage: USERS_PER_PAGE,
      })],
    };
  };

  const replyInteraction = (interaction: BaseInteraction) => {
    if (interaction.isButton()) {
      const customId = interaction.customId;
      if (!isNaN(Number(customId))) {
        paginatePage = Number(customId);
      }
    }
    return render();
  };

  return {
    render,
    replyInteraction,
  };
};

interface IRenderEmbed {
  guild: IGuild;
  users: IUser[];
  page: number;
}

interface IUserPower {
  userId: string;
  username?: string;
  power: number;
  workers?: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>[];
}


const renderEmbed = ({users, guild, page}: IRenderEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle(guild.info.name);

  const userPowers: IUserPower[] = [];
  if (guild.membersId?.length) {
    for (const memberId of guild.membersId) {
      const user = users.find(user => user.userId === memberId);
      if (user) {
        const top3Power = getTop3Power(user);
        const top3Workers = getTop3Workers(user);
        userPowers.push({
          userId: user.userId,
          username: user.username,
          power: top3Power,
          workers: top3Workers.map(worker => worker.type),
        });
      } else {
        userPowers.push({
          userId: memberId,
          power: 0,
        });
      }
    }
  }

  userPowers.sort((a, b) => b.power - a.power);

  if (userPowers.length) {
    const currentPageUsers = userPowers.slice(page * USERS_PER_PAGE, (page + 1) * USERS_PER_PAGE);

    for (let i = 0; i < currentPageUsers.length; i += USERS_PER_FIELD) {
      const rows: string[] = [];
      for (let j = 0; j < currentPageUsers.slice(i, i + USERS_PER_FIELD).length; j++) {
        const index = i + j + 1 + page * USERS_PER_PAGE;
        const user = currentPageUsers[i + j];
        const power = user.power.toFixed(2);
        const workers = user.workers?.map(worker => BOT_EMOJI.worker[worker]);
        const mentions = messageFormatter.user(user.userId);
        const username = user.username ? `(${user.username})` : '';
        rows.push(`\`[${index}]\` **${power}** | ${workers?.length ? `${workers?.join('')} | ` : ''}${mentions} ${username}`);
      }

      embed.addFields({
        name: '\u200b',
        value: rows.join('\n'),
        inline: false,
      });
    }
  } else {
    embed.addFields({
      name: '\u200b',
      value: 'No users found.',
    });
  }

  const top = userPowers[0]?.power ?? 0;
  const registeredUser = userPowers.filter(user => user.power > 0);
  const avg = registeredUser.length ? (registeredUser.reduce((acc, user) => acc + user.power, 0) / registeredUser.length) : 0;

  const description = [
    `**Top**: ${top.toFixed(2)} :boom:`,
    `**Avg**: ${avg.toFixed(2)} :boom:`,
  ];

  embed.setDescription(description.join('\n'));

  embed.setFooter({text: 'Guild members are not listed? Type `idle guild list` to register them.'});

  return embed;
};
