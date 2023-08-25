import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {idleRaid} from '../../../lib/idle-farm/progress/raid';


export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {

    // const channel = await client.channels.fetch('1135513485837619200');
    // if (!channel?.isTextBased()) return;
    // const msg = await channel.messages.fetch('1144428380725448835');
    //
    //
    // await commandHelper.raid.teamRaid({
    //   client,
    //   channelId: message.channel.id,
    //   users: [
    //     message.author,
    //     ...message.mentions.users.map(user => user),
    //   ],
    //   collected: msg,
    // });

    const msg = await message.channel.messages.fetch('1144660209676079145');
    idleRaid({
      author: message.author,
      client,
      isSlashCommand: true,
      message: msg,
    });
  },
};
