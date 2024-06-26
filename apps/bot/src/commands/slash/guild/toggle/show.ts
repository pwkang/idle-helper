import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {GUILD_SETTINGS_PAGE_TYPE} from '../../../../lib/idle-helper/command-helper/guild-settings/_show-settings';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.toggle.show.name,
  description: SLASH_COMMAND.guild.toggle.show.description,
  commandName: SLASH_COMMAND.guild.name,
  groupName: SLASH_COMMAND.guild.toggle.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip
  },
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;

    let guildSettings = await commandHelper.guildSettings.showSettings({
      server: interaction.guild!,
      type: GUILD_SETTINGS_PAGE_TYPE.toggle
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: guildSettings.getMessagePayload(),
      interactive: true,
      onStop: () => {
        guildSettings = null as any;
      }
    });
    if (!event) return;
    event.every((interaction, customId) => {
      return guildSettings.replyInteraction({
        interaction,
        customId
      });
    });
  }
};
