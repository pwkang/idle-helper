import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {SLASH_COMMAND} from '../constant';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/idle-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.help.name,
  description: SLASH_COMMAND.help.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip
  },
  type: 'command',
  execute: async (client, interaction) => {
    const search = interaction.options.getString('search') ?? undefined;
    const messageOptions = await commandHelper.botInfo.help({
      client,
      search
    });
    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      options: messageOptions,
      interaction
    });
  }
};
