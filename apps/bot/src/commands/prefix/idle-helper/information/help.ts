import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'help',
  commands: ['help', 'h'],
  preCheck: {},
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    let botHelp = commandHelper.botInfo.help({client, channelId: message.channel.id, serverId: message.guild?.id});
    const event = await djsMessageHelper.interactiveSend({
      client,
      options: botHelp.render(),
      channelId: message.channel.id,
      onEnd: () => {
        botHelp = null as any;
      },
    });
    if (!event) return;
    event.every(interaction => {
      return botHelp.replyInteraction(interaction);
    });
  },
};
