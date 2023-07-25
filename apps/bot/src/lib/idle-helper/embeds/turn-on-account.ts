import {EmbedBuilder} from 'discord.js';
import {BOT_CLICKABLE_SLASH_COMMANDS, BOT_COLOR} from '@idle-helper/constants';

const _turnOnAccount = () => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle('Opps! you have turned off the helper.')
    .setDescription(
      'You need to turn on the helper to use this command.\n' +
      `Use ${BOT_CLICKABLE_SLASH_COMMANDS.accountOn} to turn on your account.`,
    );
};

export default _turnOnAccount;
