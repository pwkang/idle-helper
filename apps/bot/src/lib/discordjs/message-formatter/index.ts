import {_formatUser} from './_user';
import {_formatChannel} from './_channel';
import {_formatRole} from './_role';
import {_getInfoFromMessageUrl, _messageUrl} from './_message-url';
import {_channelUrl, _getInfoFromChannelUrl} from './_channel-url';

const messageFormatter = {
  user: _formatUser,
  channel: _formatChannel,
  role: _formatRole,
  messageUrl: _messageUrl,
  getInfoFromMessageUrl: _getInfoFromMessageUrl,
  channelUrl: _channelUrl,
  getInfoFromChannelUrl: _getInfoFromChannelUrl,
};

export default messageFormatter;
