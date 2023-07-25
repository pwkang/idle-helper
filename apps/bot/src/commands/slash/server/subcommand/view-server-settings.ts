import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/idle-helper/command-helper/server-settings/constant';
import {IServerConfig} from './type';

export const viewServerSettings = async ({client, interaction}: IServerConfig) => {
  if (!interaction.inGuild() || !interaction.guild) return;
  const serverSettings = await commandHelper.serverSettings.settings({
    server: interaction.guild,
  });
  if (!serverSettings) return;
  const messageOptions = serverSettings.render({
    type: SERVER_SETTINGS_PAGE_TYPE.randomEvent,
  });
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: messageOptions,
    interactive: true,
  });
  if (!event) return;
  event.every((interaction) => {
    if (!interaction.isStringSelectMenu()) return null;
    return serverSettings.responseInteraction(interaction);
  });
};
