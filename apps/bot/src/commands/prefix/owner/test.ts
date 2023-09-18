import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import claimReminder from '../../../lib/idle-helper/reminder/claim-reminder';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    claimReminder.send({
      client,
      userId: message.author.id,
    });
  },
};
