import {_toggleHelper} from './toggle/toggle.helper';
import {_serverSettingsHelper} from './server-settings';
import {_botInfoHelper} from './bot-info';
import {_userAccountHelper} from './user-account';
import {_farmsHelper} from './farms';

const commandHelper = {
  toggle: _toggleHelper,
  serverSettings: _serverSettingsHelper,
  botInfo: _botInfoHelper,
  userAccount: _userAccountHelper,
  farms: _farmsHelper,
};

export default commandHelper;
