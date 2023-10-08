import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'invite',
  commands: ['invite'],
  preCheck: {},
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const botInfo = await commandHelper.botInfo.invite();
    await djsMessageHelper.send({
      client,
      options: {
        embeds: [botInfo]
      },
      channelId: message.channel.id
    });
  }
};
