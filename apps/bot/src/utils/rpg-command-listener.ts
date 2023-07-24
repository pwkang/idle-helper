import {Client, Embed, Message, MessageCollector, TextChannel, User} from 'discord.js';
import {TypedEventEmitter} from './typed-event-emitter';
import ms from 'ms';
import {sleep, typedObjectEntries} from '@idle-helper/utils';
import {IDLE_FARM_ID} from '@idle-helper/constants';

interface IRpgCommandListener {
  client: Client;
  channelId: string;
  author: User;
}

type TEventTypes = {
  embed: [Embed, Message];
  content: [Message['content'], Message];
  cooldown: [number];
  attachments: [Message['attachments'], Message];
};

type TExtraProps = {
  stop: () => void;
  pendingAnswer: () => void;
  answered: () => void;
  resetTimer: (ms: number) => void;
  triggerCollect: (message: Message) => void;
};

const filter = (m: Message) => m.author.id === IDLE_FARM_ID;

export const createRpgCommandListener = ({
  channelId,
  client,
  author,
}: IRpgCommandListener) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;
  let collector: MessageCollector | undefined;
  if (channel instanceof TextChannel) {
    // const textChannel
    collector = channel.createMessageCollector({time: 15000, filter});
  }
  if (!collector) return;
  const event = new TypedEventEmitter<TEventTypes>() as TypedEventEmitter<TEventTypes> &
    TExtraProps;
  let waitingAnswer = false;

  event.stop = () => {
    collector?.stop();
    collector?.removeAllListeners();
    event.removeAllListeners();
  };

  event.pendingAnswer = () => {
    waitingAnswer = true;
  };
  event.answered = () => {
    waitingAnswer = false;
  };

  event.resetTimer = (ms: number) => {
    collector?.resetTimer({time: ms});
  };

  event.triggerCollect = (message: Message) => {
    messageCollected(message);
  };

  collector.on('collect', messageCollected);

  async function messageCollected(collected: Message) {
    if (
      isSlashCommand({collected, author}) &&
      collected.content === '' &&
      collected.embeds.length === 0
    ) {
      await sleep(1000);
      collected = collector?.channel.messages.cache.get(collected.id) as Message;
    }

    if (collected.embeds.length) {
      const embed = collected.embeds[0];

      event.emit('embed', embed, collected);
    } else if (!collected.embeds.length) {
      // Message Content

      event.emit('content', collected.content, collected);
    }

    if (collected.attachments.size) {
      event.emit('attachments', collected.attachments, collected);
    }
  }

  return event;
};


interface IChecker {
  collected: Message;
  author: User;
}

function isSlashCommand({collected}: IChecker) {
  return collected.content === '' && collected.embeds.length === 0 && collected.interaction?.id;
}
