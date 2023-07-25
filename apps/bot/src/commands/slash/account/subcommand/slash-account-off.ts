import {IAccountSubcommand} from './type';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export const slashAccountOff = async ({client, interaction}: IAccountSubcommand) => {
  const messageOptions = await commandHelper.userAccount.turnOffAccount({
    author: interaction.user,
  });
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: messageOptions,
  });
};
