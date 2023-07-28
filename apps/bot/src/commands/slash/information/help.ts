import {SlashCommandBuilder} from 'discord.js';
import commandHelper from '../../../lib/idle-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

export default <SlashCommand>{
  name: 'help',
  builder: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show help info'),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    const botInfo = commandHelper.botInfo.help({client});
    await djsInteractionHelper.replyInteraction({
      client,
      options: botInfo.render(),
      interaction,
    });
  },
};