import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import {SLASH_COMMAND} from '../constant';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/idle-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.help.name,
  description: SLASH_COMMAND.help.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip
  },
  type: 'command',
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    let botInfo = commandHelper.botInfo.help({
      client,
      channelId: interaction.channelId,
      serverId: interaction.guildId
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      options: botInfo.render(),
      interaction,
      interactive: true,
      onStop: () => {
        botInfo = null as any;
      }
    });
    if (!event) return;
    event.every((newInteraction) => {
      return botInfo.replyInteraction(newInteraction);
    });
  }
};
