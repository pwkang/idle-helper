import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'botMarket',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['market', 'ma'],
  preCheck: {},
  execute: async (client, message) => {
    const market = await commandHelper.farms.market();
    let event = await djsMessageHelper.interactiveSend({
      client,
      options: market.render(),
      channelId: message.channel.id,
      onEnd: () => {
        event = undefined;
      }
    });
    if (!event) return;
    event.every(market.replyInteraction);
  }
};
