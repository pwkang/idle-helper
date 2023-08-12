import {BaseMessageOptions, EmbedBuilder, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR} from '@idle-helper/constants';
import convertMsToHumanReadableString from '../../../../utils/convert-ms-to-human-readable-string';

interface IFarmStatus {
  author: User;
}

export const _farmStatus = async ({author}: IFarmStatus) => {
  const userAccount = await userService.findUser({
    userId: author.id,
  });
  if (!userAccount) return null;

  const render = (): BaseMessageOptions => {
    const embed = getEmbed({
      userAccount,
      author,
    });
    return {
      embeds: [embed],
    };
  };

  return {
    render,
  };
};

interface IGetEmbed {
  author: User;
  userAccount: IUser;
}

const getEmbed = ({userAccount, author}: IGetEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username} - last claim`,
    iconURL: author.avatarURL() ?? undefined,
  });

  const duration = userAccount.farms.lastClaimedAt
    ? Date.now() - userAccount.farms.lastClaimedAt.getTime()
    : 0;

  embed.setDescription(
    `Last claim at: **${duration ? convertMsToHumanReadableString(duration) : '-'}**`,
  );

  return embed;
};
