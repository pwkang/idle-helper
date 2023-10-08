import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.toggle.set.name,
  description: SLASH_COMMAND.toggle.set.description,
  commandName: SLASH_COMMAND.toggle.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister
  },
  builder: (subcommand) =>
    subcommand
      .addStringOption((option) =>
        option
          .setName('on')
          .setDescription('Type the ID of the settings. e.g. a1 b2a')
      )
      .addStringOption((option) =>
        option
          .setName('off')
          .setDescription('Type the ID of the settings. e.g. a1 b2a')
      ),
  execute: async (client, interaction) => {
    const onStr = interaction.options.getString('on');
    const offStr = interaction.options.getString('off');
    const userToggle = await commandHelper.toggle.user({
      author: interaction.user
    });
    if (!userToggle) return;
    const messageOptions = await userToggle.update({
      on: onStr ?? undefined,
      off: offStr ?? undefined
    });
    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions
    });
  }
};
