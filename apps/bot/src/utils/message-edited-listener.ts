import {Message} from 'discord.js';
import {redisMessageEdited} from '../services/redis/message-edited.redis';
import {EventEmitter} from 'events';

const messageEditedEvent = new EventEmitter();

interface ICreateMessageEditedListener {
  messageId: string;
}

export const createMessageEditedListener = async ({
  messageId,
}: ICreateMessageEditedListener) => {
  await redisMessageEdited.register({
    messageId,
  });

  return messageEditedEvent;
};

export const emitMessageEdited = async (message: Message) => {
  const messageId = message.id;
  const isEdited = await redisMessageEdited.isEdited({
    messageId,
  });
  if (!isEdited) return;
  messageEditedEvent.emit(messageId, message);
};
