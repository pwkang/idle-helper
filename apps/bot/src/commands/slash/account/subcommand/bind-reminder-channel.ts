import commandHelper from '../../../../lib/idle-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.reminderChannel.name,
  description: SLASH_COMMAND.account.reminderChannel.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  commandName: SLASH_COMMAND.account.name,
  type: 'subcommand',
  execute: async (client, interaction) => {
    const channelId = interaction.channelId;

    const messageOptions = await commandHelper.userAccount.reminderChannel({
      userId: interaction.user.id,
      channelId,
    });

    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};