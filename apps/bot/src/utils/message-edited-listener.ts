import {TypedEventEmitter} from './typed-event-emitter';
import {Message} from 'discord.js';
import {redisMessageEdited} from '../services/redis/message-edited.redis';
import {EventEmitter} from 'events';
import ms from 'ms';

const messageEditedEvent = new EventEmitter();

interface ICreateMessageEditedListener {
  messageId: string;
  timer?: string;
}

type TEventTypes = {
  edited: [Message];
};

type TExtraProps = {
  stop: () => void;
};

export const createMessageEditedListener = async ({messageId, timer}: ICreateMessageEditedListener) => {
  await redisMessageEdited.register({
    messageId,
  });
  const event = new TypedEventEmitter<TEventTypes>() as TypedEventEmitter<TEventTypes> &
    TExtraProps;

  messageEditedEvent.on(messageId, messageEdited);

  const timeout = setTimeout(() => {
    clear();
  }, ms(timer ?? '1m'));

  event.stop = () => {
    clear();
  };

  function messageEdited(message: Message) {
    event.emit('edited', message);
  }

  function clear() {
    clearTimeout(timeout);
    event.removeAllListeners();
    messageEditedEvent.removeListener(messageId, messageEdited);
  }

  return event;
};

export const emitMessageEdited = async (message: Message) => {
  const messageId = message.id;
  const isEdited = await redisMessageEdited.isEdited({
    messageId,
  });
  if (!isEdited) return;
  messageEditedEvent.emit(messageId, message);
};
