import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';
import {GUILD_SETTINGS_PAGE_TYPE} from '../../../lib/idle-helper/command-helper/guild-settings/_show-settings';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.settings.name,
  description: SLASH_COMMAND.guild.settings.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    const guildSettings = await commandHelper.guildSettings.showSettings({
      server: interaction.guild!,
      type: GUILD_SETTINGS_PAGE_TYPE.settings,
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: guildSettings.getMessagePayload(),
      interactive: true,
    });
    if (!event) return;
    event.every((interaction, customId) => {
      return guildSettings.replyInteraction({
        interaction,
        customId,
      });
    });
  },
};
