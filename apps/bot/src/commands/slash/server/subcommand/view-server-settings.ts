import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/idle-helper/command-helper/server-settings/constant';
import {SLASH_COMMAND} from '../../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import {PermissionsBitField} from 'discord.js';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.settings.name,
  description: SLASH_COMMAND.server.settings.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  type: 'subcommand',
  commandName: SLASH_COMMAND.server.name,
  permissions: [PermissionsBitField.Flags.ManageGuild],
  execute: async (client, interaction) => {
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
  },
};
