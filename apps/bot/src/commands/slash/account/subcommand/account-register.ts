import {IAccountSubcommand} from './type';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export const slashRegisterAccount = async ({client, interaction}: IAccountSubcommand) => {
  const messageOptions = await commandHelper.userAccount.register({
    author: interaction.user,
    channelId: interaction.channelId,
  });
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: messageOptions,
  });
};
