import {IGuildToggle} from '@idle-helper/models';

interface IToggleTeamRaidReminder {
  toggle: IGuildToggle;
}

export const _toggleTeamRaidReminder = ({toggle}: IToggleTeamRaidReminder) =>
  toggle.teamRaid.reminder;
