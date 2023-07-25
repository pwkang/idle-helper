import {IAccountSubcommand} from './type';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export const slashShowUserAccount = async ({client, interaction}: IAccountSubcommand) => {
  const userSettings = await commandHelper.userAccount.settings({
    author: interaction.user,
  });
  if (!userSettings) return;
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: userSettings.render({
      type: 'settings',
    }),
    interactive: true,
  });
  if (!event) return;
  event.every(async (interaction) => {
    if (!interaction.isStringSelectMenu()) return null;
    return userSettings.responseInteraction(interaction);
  });
};
