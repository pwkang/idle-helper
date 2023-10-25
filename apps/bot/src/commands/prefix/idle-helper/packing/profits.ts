import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
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
    const container = args.includes('-c');
    const multiplier = args.includes('-m') ? args[args.indexOf('-m') + 1] : undefined;
    const messageOptions = await commandHelper.packing.showProfits({
      author: message.author,
      container,
      multiplier: isNaN(Number(multiplier)) ? undefined : Number(multiplier)
    });
    if (!messageOptions) return;
    djsMessageHelper.send({
      options: messageOptions,
      client,
      channelId: message.channel.id
    });
  }
};
