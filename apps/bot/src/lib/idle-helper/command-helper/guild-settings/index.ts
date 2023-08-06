import {_getGuildSettingsEmbed} from './embed/guild-settings.embed';
import {_showSettings} from './_showSettings';
import {_configureGuild} from './configure-guild';

export const _guildSettingsHelper = {
  renderGuildSettingsEmbed: _getGuildSettingsEmbed,
  showSettings: _showSettings,
  configure: _configureGuild,
};
