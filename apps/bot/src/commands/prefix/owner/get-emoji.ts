import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {logger} from '@idle-helper/utils';

interface Type {
  [key: string]: string;
}

export default <PrefixCommand>{
  name: 'listEmoji',
  commands: ['list emoji', 'le'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: (client, message) => {
    console.log('list emoji');
    const emojis = message.guild && [...message.guild.emojis.cache.values()];
    const emojiList =
      emojis?.map((emoji) => ({
        name: emoji.name + (emoji.animated ? '_animated' : ''),
        emoji: `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`
      })) ?? [];

    const emojiMap: Type = {};

    for (const emoji of emojiList) {
      if (!emoji.name) continue;
      emojiMap[emoji.name] = emoji.emoji;
    }
    logger({
      message: `${JSON.stringify(emojiMap)}`,
      variant: 'listEmoji',
      clusterId: client.cluster?.id
    });
  }
};
