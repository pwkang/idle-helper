import {IGuild} from '@idle-helper/models';

export const toGuild = (guild: any): IGuild => {
  return {
    toggle: guild.toggle,
    roleId: guild.roleId,
    leaderId: guild.leaderId,
    serverId: guild.serverId,
    info: {
      name: guild.info?.name,
    },
    membersId: guild.membersId,
    teamRaid: {
      channelId: guild.teamRaid?.channelId,
      message: guild.teamRaid?.message,
      readyAt: guild.teamRaid?.readyAt,
    },
  };
};