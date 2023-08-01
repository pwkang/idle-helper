import {userService} from '../../../../services/database/user.service';
import {BaseMessageOptions, EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@idle-helper/constants';

interface IClaimReminder {
  userId: string;
  hours: number[];
}

export const _claimReminder = async ({hours, userId}: IClaimReminder): Promise<BaseMessageOptions> => {
  await userService.setClaimReminders({
    userId,
    reminderHours: hours,
  });
  return {
    embeds: [getEmbed(hours)],
  };
};

const getEmbed = (hours: number[]) => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(`Reminder will be send at ${hours.join(', ')} hours.`);
};