import {SlashCommandBuilder} from 'discord.js';
import commandHelper from '../../../lib/idle-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: 'invite',
  builder: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get the invite link for the bot'),
  execute: async (client, interaction) => {
    const botInfo = await commandHelper.botInfo.invite();
    await djsInteractionHelper.replyInteraction({
      client,
      options: {
        embeds: [botInfo],
      },
      interaction,
    });
  },
};