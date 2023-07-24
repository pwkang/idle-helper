import _sendMessage from './_send-message';
import _deleteMessage from './_delete-message';
import _editMessage from './_edit-message';
import _replyMessage from './_reply-message';
import _sendInteractiveMessage from './_send-interactive-message';

export const djsMessageHelper = {
  send: _sendMessage,
  delete: _deleteMessage,
  edit: _editMessage,
  reply: _replyMessage,
  interactiveSend: _sendInteractiveMessage,
};
