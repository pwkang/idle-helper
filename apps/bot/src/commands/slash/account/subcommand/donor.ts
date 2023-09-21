import {SLASH_COMMAND} from '../../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.donor.name,
  description: SLASH_COMMAND.account.donor.description,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  commandName: SLASH_COMMAND.account.name,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    let setDonor = commandHelper.userAccount.setDonor({
      author: interaction.user,
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: setDonor.render(),
      interactive: true,
      onStop: () => {
        setDonor = null as any;
      },
    });
    if (!event) return;
    event.every(async (interaction, customId) => {
      return await setDonor.responseInteraction(customId);
    });
  },
};
