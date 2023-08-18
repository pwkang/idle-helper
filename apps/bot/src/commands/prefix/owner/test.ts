import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import messageReaders from '../../../lib/idle-farm/message-readers';
import {djsMessageHelper} from '../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {

    const msg = await message.channel.messages.fetch('1141389595817279628');
    const teamRaidInfo = messageReaders.teamRaid(msg);
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {
        embeds: msg.embeds,
        components: msg.components,
      },
    });

    // sendConfirmationMessage({
    //   client,
    //   channelId: message.channel.id,
    //   users: message.mentions.users.map(user => user),
    // });
  },
};
