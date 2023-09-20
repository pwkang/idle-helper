import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'top-power-listing',
  commands: ['guild power', 'guild p'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, message) => {
    const topPowerListing = await commandHelper.guild.topPowerListing({
      client,
      authorId: message.author.id,
      server: message.guild,
    });
    const event = await djsMessageHelper.interactiveSend({
      client,
      options: topPowerListing.render(),
      channelId: message.channel.id,
      onEnd: topPowerListing.stop,
    });
    if (!event) return;
    event.every(topPowerListing.replyInteraction);
  },
};