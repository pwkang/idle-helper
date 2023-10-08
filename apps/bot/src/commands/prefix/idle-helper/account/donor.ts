import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';

export default <PrefixCommand>{
  name: 'rpgDonor',
  commands: ['donor'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn
  },
  execute: async (client, message) => {
    let setDonor = commandHelper.userAccount.setDonor({
      author: message.author
    });
    const event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: setDonor.render(),
      onEnd: () => {
        setDonor = null as any;
      }
    });
    if (!event) return;
    event.every(async (interaction, customId) => {
      return await setDonor.responseInteraction(customId);
    });
  }
};
