import {guildService} from '../../../../services/database/guild.service';
import {_toggleTeamRaidHelper, _toggleTeamRaidReminder} from './toggle-user-checker-list';

interface IToggleGuildChecker {
  serverId: string;
  guildRoleId: string;
}

export type IToggleGuildCheckerReturnType = Awaited<ReturnType<typeof toggleGuildChecker>>;

const toggleGuildChecker = async ({guildRoleId, serverId}: IToggleGuildChecker) => {
  const guild = await guildService.findGuild({serverId, roleId: guildRoleId});
  if (!guild) return null;

  return {
    teamRaid: {
      helper: _toggleTeamRaidHelper({toggle: guild.toggle}),
      reminder: _toggleTeamRaidReminder({toggle: guild.toggle}),
    },
  };
};

export default toggleGuildChecker;
