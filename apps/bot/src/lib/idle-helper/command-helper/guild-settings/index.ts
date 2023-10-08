import {_getGuildSettingsEmbed} from './embed/guild-settings.embed';
import {_showSettings} from './_show-settings';
import {_configureGuild} from './configure-guild';
import {_memberTracker} from './_member-tracker';

export const _guildSettingsHelper = {
  renderGuildSettingsEmbed: _getGuildSettingsEmbed,
  showSettings: _showSettings,
  configure: _configureGuild,
  memberTracker: _memberTracker
};
