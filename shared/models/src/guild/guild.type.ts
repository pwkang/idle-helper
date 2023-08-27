export interface IGuildToggle {
  teamRaid: {
    helper: boolean;
    reminder: boolean;
  };
}

export interface IGuild {
  serverId: string;
  leaderId: string;
  roleId: string;
  toggle: IGuildToggle;
  info: {
    name: string;
  };
  teamRaid: {
    channelId: string;
    readyAt: Date;
    message: string;
  };
  membersId: string[];
}
