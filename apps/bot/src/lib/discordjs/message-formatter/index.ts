import {_formatUser} from './_user';
import {_formatChannel} from './_channel';
import {_formatRole} from './_role';

const messageFormatter = {
  user: _formatUser,
  channel: _formatChannel,
  role: _formatRole,
};

export default messageFormatter;
