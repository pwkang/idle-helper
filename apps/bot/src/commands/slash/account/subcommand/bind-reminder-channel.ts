import {IAccountSubcommand} from './type';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const slashBindReminderChannel = async ({client, interaction}: IAccountSubcommand) => {
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

};