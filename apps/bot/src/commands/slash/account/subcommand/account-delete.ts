import {IAccountSubcommand} from './type';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export const slashAccountDelete = async ({client, interaction}: IAccountSubcommand) => {
  const deleteAccount = commandHelper.userAccount.deleteAccount({
    author: interaction.user,
  });
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: deleteAccount.render(),
    interactive: true,
  });
  if (!event) return;
  event.every(async (interaction, customId) => {
    return await deleteAccount.responseInteraction(customId);
  });
};
