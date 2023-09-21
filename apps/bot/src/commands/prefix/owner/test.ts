import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import commandHelper from '../../../lib/idle-helper/command-helper';
import LeakDetector from 'jest-leak-detector';
import {djsMessageHelper} from '../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const a = await commandHelper.farms.status({
      author: message.author,
    });
    if (!a) return;
    const event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: a?.render(),
      onEnd: () => {

      },
    });
    event?.on('collect', async () => {
      return null;
    });
    const detector = new LeakDetector(event);
    setTimeout(() => {
      detector.isLeaking().then((leaks) => {
        console.log(leaks);
      });
    }, 5000);
  },
};
