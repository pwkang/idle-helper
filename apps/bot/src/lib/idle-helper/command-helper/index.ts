import {_toggleHelper} from './toggle/toggle.helper';
import {_serverSettingsHelper} from './server-settings';
import {_botInfoHelper} from './bot-info';
import {_userAccountHelper} from './user-account';
import {_farmsHelper} from './farms';
import {_guildSettingsHelper} from './guild-settings';
import {_guildHelper} from './guild';

const commandHelper = {
  toggle: _toggleHelper,
  serverSettings: _serverSettingsHelper,
  botInfo: _botInfoHelper,
  userAccount: _userAccountHelper,
  farms: _farmsHelper,
  guildSettings: _guildSettingsHelper,
  guild: _guildHelper,
};

export default commandHelper;
