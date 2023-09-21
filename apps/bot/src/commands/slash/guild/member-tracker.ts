import {SLASH_COMMAND} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.memberTracker.name,
  description: SLASH_COMMAND.guild.memberTracker.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  builder: (subcommand) =>
    subcommand.addRoleOption((option) =>
      option.setName('role').setDescription('Guild role of the guild').setRequired(true),
    ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);
    if (!('guild' in role)) return;
    let memberTracker = await commandHelper.guildSettings.memberTracker({
      server: interaction.guild!,
      guildRole: role,
      client,
      author: interaction.user,
      channelId: interaction.channelId,
    });
    if (!memberTracker) return;
    await djsInteractionHelper.replyInteraction({
      client,
      options: memberTracker.getMessagePayload(),
      interaction,
      onStop: () => {
        memberTracker = null as any;
      },
    });
  },
};
