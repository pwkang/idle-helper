import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'help',
  commands: ['help', 'h'],
  preCheck: {},
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message, args) => {
    const messageOptions = await commandHelper.botInfo.help({
      client,
      search: args.slice(1).join(' ')
    });
    if (!messageOptions) return;
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: messageOptions
    });

  }
};
