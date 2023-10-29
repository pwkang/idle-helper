import {
  PREFIX_COMMAND_TYPE,
  TAX_RATE_BOX,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'packing-profits',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['packing', 'pa'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister
  },
  execute: async (client, message, args) => {
    const multiplier = args.includes('-m') ? args[args.indexOf('-m') + 1] : undefined;
    const isF2P = args.includes('-f2p');
    const isP2W = args.includes('-p2w');
    const messageOptions = await commandHelper.packing.showProfits({
      author: message.author,
      multiplier: isNaN(Number(multiplier)) ? undefined : Number(multiplier),
      taxValue: isF2P ? TAX_RATE_BOX['non-donor'] : isP2W ? TAX_RATE_BOX['wise'] : undefined
    });
    if (!messageOptions) return;
    djsMessageHelper.send({
      options: messageOptions,
      client,
      channelId: message.channel.id
    });
  }
};
