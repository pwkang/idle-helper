import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {SLASH_COMMAND} from '../../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.delete.name,
  description: SLASH_COMMAND.account.delete.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister
  },
  commandName: SLASH_COMMAND.account.name,
  type: 'subcommand',
  execute: async (client, interaction) => {
    let deleteAccount = commandHelper.userAccount.deleteAccount({
      author: interaction.user
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: deleteAccount.render(),
      interactive: true,
      onStop: () => {
        deleteAccount = null as any;
      }
    });
    if (!event) return;
    event.every(async (_, customId) => {
      return await deleteAccount.responseInteraction(customId);
    });
  }
};
