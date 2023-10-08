import {_toggleHelper} from './toggle/toggle.helper';
import {_serverSettingsHelper} from './server-settings';
import {_botInfoHelper} from './bot-info';
import {_userAccountHelper} from './user-account';
import {_farmsHelper} from './farms';
import {_guildSettingsHelper} from './guild-settings';
import {_guildHelper} from './guild';
import {_calculatorHelper} from './calculator';
import {_raidHelper} from './raid-helper';
import {_workersHelper} from './workers';
import {_leaderboardHelper} from './leaderboard';
import {_generatorHelper} from './generator';
import {_packingHelper} from './packing';

const commandHelper = {
  toggle: _toggleHelper,
  serverSettings: _serverSettingsHelper,
  botInfo: _botInfoHelper,
  userAccount: _userAccountHelper,
  farms: _farmsHelper,
  guildSettings: _guildSettingsHelper,
  guild: _guildHelper,
  calculator: _calculatorHelper,
  raid: _raidHelper,
  workers: _workersHelper,
  leaderboard: _leaderboardHelper,
  generator: _generatorHelper,
  packing: _packingHelper
};

export default commandHelper;
