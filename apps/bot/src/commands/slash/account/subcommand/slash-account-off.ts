import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {SLASH_COMMAND} from '../../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.off.name,
  description: SLASH_COMMAND.account.off.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commandName: SLASH_COMMAND.account.name,
  type: 'subcommand',
  execute: async (client, interaction) => {
    const messageOptions = await commandHelper.userAccount.turnOffAccount({
      author: interaction.user,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
