import {BaseMessageOptions, EmbedBuilder, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {IUser} from '@idle-helper/models';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_TIME_BOOSTER_DURATION} from '@idle-helper/constants';
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
    const embed = getLastClaimEmbed({
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

export const getLastClaimEmbed = ({userAccount, author}: IGetEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username} - last claim`,
    iconURL: author.avatarURL() ?? undefined,
  });
  const timeSpeederUsed = userAccount.farms.itemsUsed.timeSpeeder;
  const timeCompressorUsed = userAccount.farms.itemsUsed.timeCompressor;

  const duration = userAccount.farms.lastClaimedAt
    ? Date.now() - userAccount.farms.lastClaimedAt.getTime()
    : 0;

  const totalDuration =
    duration +
    timeSpeederUsed * IDLE_FARM_TIME_BOOSTER_DURATION.timeSpeeder +
    timeCompressorUsed * IDLE_FARM_TIME_BOOSTER_DURATION.timeCompressor;

  embed.setDescription(
    `Total idling: **${totalDuration ? convertMsToHumanReadableString(totalDuration) : '-'}**`,
  );

  embed.addFields({
    name: 'Summary',
    value: [
      `:stopwatch: **Base:** ${duration ? convertMsToHumanReadableString(duration) : ' - '}`,
      `${BOT_EMOJI.items.timeSpeeder} **Time Speeder:** ${timeSpeederUsed}`,
      `${BOT_EMOJI.items.timeCompressor} **Time Compressor:** ${timeCompressorUsed}`,
    ].join('\n'),
  });

  return embed;
};
