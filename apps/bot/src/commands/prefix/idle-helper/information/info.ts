import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'info',
  commands: ['info'],
  preCheck: {},
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const botInfo = await commandHelper.botInfo.info({client, server: message.guild!});
    await djsMessageHelper.send({
      client,
      options: {
        embeds: [botInfo],
      },
      channelId: message.channel.id,
    })
  },
}