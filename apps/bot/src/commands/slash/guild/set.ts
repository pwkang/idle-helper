import {SLASH_COMMAND} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {guildService} from '../../../services/database/guild.service';
import {PermissionsBitField} from 'discord.js';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.set.name,
  description: SLASH_COMMAND.guild.set.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  permissions: [PermissionsBitField.Flags.ManageGuild],
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

    const isRoleUsed = await guildService.isRoleUsed({
      serverId: interaction.guildId!,
      roleId: role.id,
    });
    if (!isRoleUsed) {
      return djsInteractionHelper.replyInteraction({
        client,
        interaction,
        options: {
          content: `There is no guild with role ${role} setup in this server`,
          ephemeral: true,
        },
      });
    }

    const updatedGuild = await guildService.updateGuildReminder({
      channelId: channel?.id,
      serverId: interaction.guildId!,
      roleId: role.id,
      reminderMessage,
    });
    if (!updatedGuild) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        embeds: [
          commandHelper.guildSettings.renderGuildSettingsEmbed({
            guildAccount: updatedGuild!,
          }),
        ],
      },
    });
  },
};
