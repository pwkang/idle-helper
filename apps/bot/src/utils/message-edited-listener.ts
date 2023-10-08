import type {Message} from 'discord.js';
import {redisMessageEdited} from '../services/redis/message-edited.redis';
import {EventEmitter} from 'events';
import ms from 'ms';

const messageEditedEvent = new EventEmitter();

interface ICreateMessageEditedListener {
  messageId: string;
  timeout?: number;
}

export const createMessageEditedListener = async ({
  messageId,
  timeout = ms('10m')
}: ICreateMessageEditedListener) => {
  await redisMessageEdited.register({
    messageId
  });

  messageEditedEvent.on = (
    messageId: string | symbol,
    callback: (message: Message) => void
  ): any => {
    setTimeout(() => {
      messageEditedEvent.removeListener(messageId, callback);
    }, timeout);

    return messageEditedEvent.addListener(messageId, callback);
  };

  return messageEditedEvent;
};

export const emitMessageEdited = async (message: Message) => {
  const messageId = message.id;
  const isEdited = await redisMessageEdited.isEdited({
    messageId
  });
  if (!isEdited) return;
  messageEditedEvent.emit(messageId, message);
};

interface IRemoveMessageEditedListener {
  messageId: string;
  callback: (message: Message) => void;
  timeout?: number;
}

export const removeMessageEditedListener = async ({
  timeout = ms('10m'),
  messageId,
  callback
}: IRemoveMessageEditedListener) => {
  setTimeout(() => {
    messageEditedEvent.removeListener(messageId, callback);
  }, timeout);
};
