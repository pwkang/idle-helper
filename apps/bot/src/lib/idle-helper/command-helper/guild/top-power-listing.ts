import {guildService} from '../../../../services/database/guild.service';
import {userChecker} from '../../user-checker';
import {BaseMessageOptions, Client, EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {IGuild, IUser} from '@idle-helper/models';
import {BOT_COLOR} from '@idle-helper/constants';
import {getTop3Power} from '../../../../utils/getTop3Power';
import messageFormatter from '../../../discordjs/message-formatter';

interface ITopPowerListing {
  serverId: string;
  authorId: string;
  client: Client,
}

export const _topPowerListing = async ({serverId, authorId, client}: ITopPowerListing) => {
  const serverGuilds = await guildService.getAllGuilds({
    serverId,
  });
  const userGuild = await guildService.findUserGuild({
    userId: authorId,
  });
  const isServerAdmin = await userChecker.isServerAdmin({
    serverId,
    userId: authorId,
    client,
  });
  const availableGuilds = serverGuilds.filter(guild =>
    isServerAdmin ||
    guild.leaderId === authorId ||
    guild.membersId.includes(authorId));

  if (userGuild && availableGuilds.every(guild => guild.roleId !== userGuild.roleId))
    availableGuilds.unshift(userGuild);
  const guildMembers = availableGuilds.flatMap(guild => guild.membersId);
  const users = await userService.getUsersById({
    userIds: guildMembers,
  });
  const displayType: ValuesOf<typeof USER_DISPLAY_TYPE> = USER_DISPLAY_TYPE.mentions;

  const render = (): BaseMessageOptions => {
    if (!isServerAdmin)
      return {
        content: 'You must be server admin to use this command.',
      };
    if (!availableGuilds.length)
      return {
        content: 'No guilds found.',
      };


    return {
      embeds: [
        renderEmbed({
          guild: availableGuilds[0],
          users,
          displayType,
        }),
      ],
    };
  };

  return {
    render,
  };
};

const USER_DISPLAY_TYPE = {
  mentions: 'mentions',
  username: 'username',
} as const;

interface IRenderEmbed {
  guild: IGuild;
  users: IUser[];
  displayType: ValuesOf<typeof USER_DISPLAY_TYPE>;
}

interface IUserPower {
  userId: string;
  username: string;
  power: number;
}

const USERS_PER_FIELD = 10;

const renderEmbed = ({users, guild, displayType}: IRenderEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle(guild.info.name);

  const userPowers: IUserPower[] = [];
  if (guild.membersId?.length) {
    for (const memberId of guild.membersId) {
      const user = users.find(user => user.userId === memberId);
      if (!user) continue;
      const top3Power = getTop3Power(user);
      if (!top3Power) continue;
      userPowers.push({
        userId: user.userId,
        username: user.username,
        power: top3Power,
      });
    }
  }

  userPowers.sort((a, b) => b.power - a.power);
  if (userPowers.length)
    for (let i = 0; i < userPowers.length; i += USERS_PER_FIELD) {
      embed.addFields({
        name: '\u200b',
        value: userPowers
          .slice(i, i + USERS_PER_FIELD)
          .map((user, index) => `\`[${String(i + index + 1).padStart(2, ' ')}]\` **${user.power.toFixed(2)}** | ${messageFormatter.user(user.userId)} (${user.username})`).join('\n'),
        inline: false,
      });
    }
  else
    embed.addFields({
      name: '\u200b',
      value: 'No users found.',
    });


  const top = userPowers[0]?.power ?? 0;
  const avg = userPowers.length ? (userPowers.reduce((acc, user) => acc + user.power, 0) / userPowers.length) : 0;

  const description = [
    `**Top**: ${top.toFixed(2)} :boom:`,
    `**Avg**: ${avg.toFixed(2)} :boom:`,
  ];

  embed.setDescription(description.join('\n'));

  return embed;
};