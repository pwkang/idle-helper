import type { User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {BOT_CLICKABLE_SLASH_COMMANDS, BOT_COLOR} from '@idle-helper/constants';

interface IHowToRegister {
  author: User;
}

const _howToRegisterEmbed = ({author}: IHowToRegister) => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle(`Hi, ${author.username}!`)
    .setDescription(
      `Looks like you haven't registered yet.\nPlease use ${BOT_CLICKABLE_SLASH_COMMANDS.accountRegister} to register an account.`
    );
};

export default _howToRegisterEmbed;
