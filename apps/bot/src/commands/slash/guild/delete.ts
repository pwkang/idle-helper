import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.delete.name,
  description: SLASH_COMMAND.guild.delete.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  builder: (subcommand) =>
    subcommand.addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('Select the role of the guild to delete')
        .setRequired(true),
    ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);

    const configureGuild = await commandHelper.guildSettings.configure({
      server: interaction.guild!,
      roleId: role.id,
      author: interaction.user,
      client,
    });
    const messageOptions = await configureGuild.deleteGuild();
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
      interactive: true,
    });
    if (!event) return;
    event.every(async interaction => {
      return await configureGuild.deleteGuildConfirmation({
        interaction,
      });
    });
  },
};