import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../../constant';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.toggle.set.name,
  description: SLASH_COMMAND.guild.toggle.set.description,
  commandName: SLASH_COMMAND.guild.name,
  groupName: SLASH_COMMAND.guild.toggle.name,
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
      .addStringOption((option) => option.setName('on').setDescription('Features to turn on'))
      .addStringOption((option) => option.setName('off').setDescription('Features to turn off')),
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    const guildRole = interaction.options.getRole('role', true);
    const onStr = interaction.options.getString('on');
    const offStr = interaction.options.getString('off');

    const toggleGuild = await commandHelper.toggle.guild({
      serverId: interaction.guildId,
      roleId: guildRole.id,
    });

    if (!toggleGuild)
      return djsInteractionHelper.replyInteraction({
        client,
        interaction,
        options: {
          content: `There is no guild with role ${guildRole} setup in this server`,
          ephemeral: true,
        },
      });

    const messageOptions = await toggleGuild.update({
      on: onStr ?? undefined,
      off: offStr ?? undefined,
    });

    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
