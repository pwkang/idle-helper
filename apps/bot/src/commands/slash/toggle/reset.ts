import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../constant';
import commandHelper from '../../../lib/idle-helper/command-helper';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';

export default <SlashCommand>{
  name: SLASH_COMMAND.toggle.reset.name,
  description: SLASH_COMMAND.toggle.reset.description,
  commandName: SLASH_COMMAND.toggle.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister
  },
  execute: async (client, interaction) => {
    const userToggle = await commandHelper.toggle.user({
      author: interaction.user
    });
    if (!userToggle) return;
    const messageOptions = await userToggle.reset();
    if (!messageOptions) return;

    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions
    });
  }
};
