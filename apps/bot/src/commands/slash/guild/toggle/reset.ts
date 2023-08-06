import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.toggle.reset.name,
  description: SLASH_COMMAND.guild.toggle.reset.description,
  commandName: SLASH_COMMAND.guild.name,
  groupName: SLASH_COMMAND.guild.toggle.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  builder: (subcommand) =>
    subcommand.addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('Select the role of the guild to reset')
        .setRequired(true),
    ),
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    const guildRole = interaction.options.getRole('role', true);

    const configureGuild = await commandHelper.guildSettings.configure({
      author: interaction.user,
      client,
      server: interaction.guild!,
      roleId: guildRole.id,
    });

    const messageOptions = await configureGuild.resetToggle();

    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
