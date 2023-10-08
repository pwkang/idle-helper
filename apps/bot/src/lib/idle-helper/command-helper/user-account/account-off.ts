import type {BaseMessageOptions, User} from 'discord.js';
import { EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {BOT_COLOR} from '@idle-helper/constants';

interface ITurnOnAccount {
  author: User;
}

export const _turnOffAccount = async ({
  author
}: ITurnOnAccount): Promise<BaseMessageOptions> => {
  await userService.turnOffAccount({userId: author.id});
  return {
    embeds: [embed]
  };
};

const embed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('Successfully turned off the helper!');
