import {EmbedBuilder} from 'discord.js';
import {BOT_CLICKABLE_SLASH_COMMANDS, BOT_COLOR} from '@idle-helper/constants';

const _setDonorEmbed = () => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(`You have not set your donor tier yet. Please use ${BOT_CLICKABLE_SLASH_COMMANDS.accountDonor} to set your donor tier.`);

};

export default _setDonorEmbed;