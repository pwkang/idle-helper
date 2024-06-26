import {userService} from '../../../../services/database/user.service';
import type {BaseMessageOptions} from 'discord.js';
import { EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@idle-helper/constants';
import claimReminder from '../../reminder/claim-reminder';

interface IClaimReminder {
  userId: string;
  hours: number[];
}

export const _claimReminder = async ({
  hours,
  userId
}: IClaimReminder): Promise<BaseMessageOptions> => {
  if (hours.length === 0) {
    return {
      embeds: [getInvalidHoursEmbed()]
    };
  }

  await userService.setClaimReminders({
    userId,
    reminderHours: hours
  });
  await claimReminder.update({
    userId
  });
  return {
    embeds: [getEmbed(hours)]
  };
};

const getEmbed = (hours: number[]) => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(`Reminder will be send at ${hours.join(', ')} hours.`);
};

const getInvalidHoursEmbed = () => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription('Invalid hours');
};
