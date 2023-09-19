import {Client, Embed, Message, MessageCollector, TextChannel, ThreadChannel, User} from 'discord.js';
import {TypedEventEmitter} from './typed-event-emitter';
import {IDLE_FARM_ID} from '@idle-helper/constants';
import {createMessageEditedListener} from './message-edited-listener';
import ms from 'ms';

interface IIdleFarmCommandListener {
  client: Client;
  channelId: string;
  author: User;
}

type TEventTypes = {
  embed: [Embed, Message<true>];
  content: [Message['content'], Message<true>];
  cooldown: [number];
  attachments: [Message['attachments'], Message<true>];
};

type TExtraProps = {
  stop: () => void;
  pendingAnswer: () => void;
  answered: () => void;
  resetTimer: (ms: number) => void;
  triggerCollect: (message: Message) => void;
};

const filter = (m: Message) => m.author.id === IDLE_FARM_ID;

export const createIdleFarmCommandListener = ({
  channelId,
  client,
  author,
}: IIdleFarmCommandListener) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;
  let collector: MessageCollector | undefined;
  if (channel instanceof TextChannel) {
    collector = channel.createMessageCollector({time: ms('1m'), filter});
  }
  if (channel instanceof ThreadChannel) {
    collector = channel.createMessageCollector({time: ms('1m'), filter});
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
    if (!collected.inGuild()) return;
    if (isLoadingContent({collected, author})) {
      return awaitEdit(collected.id);
    }
    if (collected.embeds.length) {
      const embed = collected.embeds[0];

      if (isUserSpamming({collected, author})) {
        event.stop();
        return;
      }

      event.emit('embed', embed, collected);
    } else if (!collected.embeds.length) {
      // Message Content
      if (isBotMaintenance({collected, author})) {
        event.stop();
        return;
      }

      if (isUserInCommand({author, collected})) {
        if (waitingAnswer) {
          return;
        } else {
          event.stop();
          return;
        }
      }

      event.emit('content', collected.content, collected);
    }

    if (collected.attachments.size) {
      event.emit('attachments', collected.attachments, collected);
    }
  }

  const awaitEdit = async (messageId: string) => {
    const event = await createMessageEditedListener({
      messageId,
    });
    event.on(messageId, (message) => {
      messageCollected(message);
    });
  };

  return event;
};

interface IChecker {
  collected: Message;
  author: User;
}

function isBotMaintenance({author, collected}: IChecker) {
  return (
    collected.content.includes('The bot is under maintenance!') && collected.mentions.has(author.id)
  );
}

function isUserSpamming({author, collected}: IChecker) {
  const embed = collected.embeds[0];
  if (!embed) return false;
  return (
    embed.author?.name === author.username && embed.fields[0]?.name.includes('please don\'t spam')
  );
}

const isLoadingContent = ({collected}: IChecker) =>
  (collected.content === '' && collected.embeds.length === 0) ||
  collected.content === 'loading the guild member list...';

function isUserInCommand({author, collected}: IChecker) {
  return (
    collected.content.includes('end your previous command') && collected.mentions.has(author.id)
  );
}
