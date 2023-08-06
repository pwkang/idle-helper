import {SLASH_COMMAND} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.reminder.name,
  description: SLASH_COMMAND.guild.reminder.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  builder: (subcommand) =>
    subcommand
      .addRoleOption((option) =>
        option
          .setName('role')
          .setDescription('Select the role of the guild to update')
          .setRequired(true),
      )
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Channel to send reminder message'),
      )
      .addStringOption((option) =>
        option
          .setName('reminder-message')
          .setDescription('Message to send when team raid is ready'),
      ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);
    const channel = interaction.options.getChannel('channel');
    const reminderMessage = interaction.options.getString('reminder-message') ?? undefined;

    const configureGuild = await commandHelper.guildSettings.configure({
      server: interaction.guild!,
      roleId: role.id,
      author: interaction.user,
      client,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: await configureGuild.updateGuild({
        channelId: channel?.id,
        reminderMessage,
        roleId: role.id,
      }),
    });
  },
};
