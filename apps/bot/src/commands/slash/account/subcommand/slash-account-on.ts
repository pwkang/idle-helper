import {IAccountSubcommand} from './type';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export const slashAccountOn = async ({client, interaction}: IAccountSubcommand) => {
  const messageOptions = await commandHelper.userAccount.turnOnAccount({
    author: interaction.user,
  });
  await djsInteractionHelper.replyInteraction({
    options: messageOptions,
    interaction,
    client,
  });
};
