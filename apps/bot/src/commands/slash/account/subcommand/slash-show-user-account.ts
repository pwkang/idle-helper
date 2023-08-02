import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {SLASH_COMMAND} from '../../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.settings.name,
  description: SLASH_COMMAND.account.settings.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  commandName: SLASH_COMMAND.account.name,
  type: 'subcommand',
  execute: async (client, interaction) => {
    const userSettings = await commandHelper.userAccount.settings({
      author: interaction.user,
    });
    if (!userSettings) return;
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: userSettings.render({
        type: 'settings',
      }),
      interactive: true,
    });
    if (!event) return;
    event.every(async (interaction) => {
      if (!interaction.isStringSelectMenu()) return null;
      return userSettings.responseInteraction(interaction);
    });
  },
};
