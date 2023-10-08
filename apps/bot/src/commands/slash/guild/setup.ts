import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.setup.name,
  description: SLASH_COMMAND.guild.setup.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true
  },
  builder: (subcommand) =>
    subcommand
      .addRoleOption((option) =>
        option
          .setName('role')
          .setDescription(
            'Only user with this role can trigger guild reminder, duel log, etc.'
          )
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName('leader')
          .setDescription(
            'User that can modify the guild settings without admin permission'
          )
      ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);
    const leader = interaction.options.getUser('leader') ?? undefined;

    const configureGuild = await commandHelper.guildSettings.configure({
      client,
      roleId: role.id,
      server: interaction.guild!,
      author: interaction.user
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: await configureGuild.setupNewGuild({
        leader: leader
      })
    });
  }
};
