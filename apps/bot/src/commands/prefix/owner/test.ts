import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';
import {sendConfirmationMessage} from '../../../lib/idle-farm/guild/team-raid';


export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {

    const channel = await client.channels.fetch('1135513485837619200');
    if (!channel?.isTextBased()) return;
    const msg = await channel.messages.fetch('1144423364472098957');
    
    const involvedUsers = new Set([
      message.author,
      ...message.mentions.users.map(user => user),
    ]);

    sendConfirmationMessage({
      channelId: message.channel.id,
      client,
      users: [...involvedUsers],
    });

    await commandHelper.raid.teamRaid({
      client,
      channelId: message.channel.id,
      users: [...involvedUsers],
      collected: msg,
    });

  },
};
