import {_toggleHelper} from './toggle/toggle.helper';
import {_serverSettingsHelper} from './server-settings';

const commandHelper = {
  toggle: _toggleHelper,
  serverSettings: _serverSettingsHelper,
};

export default commandHelper;
