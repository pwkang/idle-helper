import djsInteractionHelper from '../../lib/discordjs/interaction';
import {SLASH_COMMAND} from './constant';
import commandHelper from '../../lib/idle-helper/command-helper';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

export default <SlashCommand>{
  name: SLASH_COMMAND.lastClaim.name,
  description: SLASH_COMMAND.lastClaim.description,
  type: 'command',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, interaction) => {
    const status = await commandHelper.farms.status({
      author: interaction.user,
    });
    if (!status) return;
    await djsInteractionHelper.replyInteraction({
      client,
      options: status.render(),
      interaction,
    });
  },
};
