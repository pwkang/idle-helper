import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {SLASH_COMMAND} from '../../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.claimReminder.name,
  description: SLASH_COMMAND.account.claimReminder.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  commandName: SLASH_COMMAND.account.name,
  type: 'subcommand',
  builder: (subcommand) =>
    subcommand
      .addStringOption((option) =>
        option
          .setName('hours')
          .setDescription('Separated multiple time by space, e.g. 4 12 24')
          .setRequired(true),
      ),
  execute: async (client, interaction) => {
    const hours = interaction.options.getString('hours', true);
    const reminderHours = hours.split(' ').map((hour) => parseInt(hour)).filter((hour) => !isNaN(hour)).filter((hour) => hour >= 0 && hour <= 24);

    const messageOptions = await commandHelper.userAccount.claimReminder({
      userId: interaction.user.id,
      hours: reminderHours,
    });

    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });

  },
};