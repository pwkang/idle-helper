import {BaseMessageOptions, EmbedBuilder, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {BOT_COLOR} from '@idle-helper/constants';

interface IRegisterAccount {
  author: User;
  channelId: string;
}

export const _registerAccount = async ({
  author,
  channelId,
}: IRegisterAccount): Promise<BaseMessageOptions> => {
  const created = await userService.registerUser({
    userId: author.id,
    username: author.username,
    channelId,
  });
  if (created) {
    return {
      embeds: [registeredEmbed],
    };
  } else {
    return {
      content: 'You have already registered!',
    };
  }
};

const registeredEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setTitle('Successfully registered your account!');
