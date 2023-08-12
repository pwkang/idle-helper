import {PREFIX, PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'userLastClaim',
  commands: ['lastClaim', 'lc', 'status'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message, args) => {
    const status = await commandHelper.farms.status({
      author: message.author,
    });
    if (!status) return;
    await djsMessageHelper.send({
      client,
      channelId: message.channelId,
      options: status.render(),
    });
    if (args.includes('status')) {
      await djsMessageHelper.send({
        client,
        channelId: message.channelId,
        options: {
          content: `This command has been changed to \`${PREFIX.bot}lastclaim\` or \`${PREFIX.bot}lc\`\n\`${PREFIX.bot}status\` will be removed in few days.`,
        },
      });
    }
  },
};
