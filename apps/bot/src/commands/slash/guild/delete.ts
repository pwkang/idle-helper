import {guildService} from '../../../services/database/guild.service';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import messageFormatter from '../../../lib/discordjs/message-formatter';
import {SLASH_COMMAND} from '../constant';
import {BOT_COLOR, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.delete.name,
  description: SLASH_COMMAND.guild.delete.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
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
    const guildAccount = await guildService.findGuild({
      roleId: role.id,
      serverId: interaction.guildId!,
    });
    if (!guildAccount)
      return djsInteractionHelper.replyInteraction({
        client,
        interaction,
        options: {
          content: `There is no guild with role ${role} setup in this server`,
          ephemeral: true,
        },
      });
    const embed = await commandHelper.guildSettings.renderGuildSettingsEmbed({
      guildAccount: guildAccount,
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        content: 'Are you sure you want to delete this guild?',
        embeds: [embed],
        components: [actionRow],
      },
      interactive: true,
    });
    if (!event) return;
    event.on('yes', async () => {
      await guildService.deleteGuild({
        roleId: role.id,
        serverId: interaction.guildId!,
      });
      return {
        content: '',
        embeds: [
          new EmbedBuilder()
            .setDescription(`Successfully deleted guild - ${messageFormatter.role(role.id)}`)
            .setColor(BOT_COLOR.embed),
        ],
        components: [],
      };
    });
    event.on('no', async () => {
      return {
        content: `Cancelled`,
        embeds: [],
        components: [],
      };
    });
  },
};

const actionRow = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder().setCustomId('yes').setLabel('Yes').setStyle(ButtonStyle.Success),
  )
  .addComponents(new ButtonBuilder().setCustomId('no').setLabel('No').setStyle(ButtonStyle.Danger));
