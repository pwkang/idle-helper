import {IAccountSubcommand} from './type';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export const setClaimReminder = async ({client, interaction}: IAccountSubcommand) => {
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

};