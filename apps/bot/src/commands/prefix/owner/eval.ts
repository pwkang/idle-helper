import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {djsMessageHelper} from '../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'eval',
  commands: ['eval'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const cmd = message.content.match(/```js\n(.*)```/s)?.[1];
    if (!cmd) {
      await djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          content: 'Please provide a code to eval',
        },
      });
      return;
    }
    try {
      const result = eval(cmd);
      await djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          content: `\`\`\`js\n${result}\`\`\``,
        },
      });
    } catch (e) {
      await djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          content: '```js\nError Encountered```',
        },
      });
    }
  },
};