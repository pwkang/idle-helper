import {userService} from '../../../../services/database/user.service';
import {BaseMessageOptions, EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@idle-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';

interface IReminderChannel {
  userId: string;
  channelId: string;
}

export const _reminderChannel = async ({
  userId,
  channelId,
}: IReminderChannel): Promise<BaseMessageOptions> => {
  await userService.updateReminderChannel({
    channelId,
    userId,
  });

  return {
    embeds: [getEmbed(channelId)],
  };
};

const getEmbed = (channelId: string) =>
  new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(`Reminder channel has been set to ${messageFormatter.channel(channelId)}`);
