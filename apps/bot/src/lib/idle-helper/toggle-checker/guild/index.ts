import {guildService} from '../../../../services/database/guild.service';
import {_toggleTeamRaidReminder} from './toggle-user-checker-list';

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
      reminder: _toggleTeamRaidReminder({toggle: guild.toggle}),
    },
  };
};

export default toggleGuildChecker;
