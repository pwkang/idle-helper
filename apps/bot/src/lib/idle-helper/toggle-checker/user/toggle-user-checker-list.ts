import {IUserToggle} from '@idle-helper/models';

interface IToggleClaimReminder {
  toggle: IUserToggle;
}

export const _toggleClaimReminder = ({toggle}: IToggleClaimReminder) =>
  toggle.reminder.claim;

interface IToggleRaidHelper {
  toggle: IUserToggle;
}

export const _toggleRaidHelper = ({toggle}: IToggleRaidHelper) =>
  toggle.raidHelper;