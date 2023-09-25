import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async () => {
    // const raidMessage = await message.channel.messages.fetch(args[1]);
    // if (!raidMessage) return;
    // const user = await userService.findUser({userId: message.author.id});
    // if (!user) return;
    // const embed = generateEmbed({
    //   userWorkers: user.workers,
    //   raidMessage,
    //   solution: {},
    // });
    // const components = generateComponents({
    //   userWorkers: user.workers,
    //   raidMessage,
    // });
    // await djsMessageHelper.send({
    //   client,
    //   channelId: message.channel.id,
    //   options: {
    //     embeds: [embed],
    //     components,
    //   },
    // });
  },
};
