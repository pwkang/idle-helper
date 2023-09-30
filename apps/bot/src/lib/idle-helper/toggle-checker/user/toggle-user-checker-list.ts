import {IUserToggle} from '@idle-helper/models';

interface IToggleClaimReminder {
  toggle: IUserToggle;
}

export const _toggleClaimReminder = ({toggle}: IToggleClaimReminder) => toggle.reminder.claim;

export const _toggleVoteReminder = ({toggle}: IToggleClaimReminder) => toggle.reminder.vote;

export const _toggleDailyReminder = ({toggle}: IToggleClaimReminder) => toggle.reminder.daily;

interface IToggleRaidHelper {
  toggle: IUserToggle;
}

export const _toggleRaidHelper = ({toggle}: IToggleRaidHelper) => toggle.raid.helper;

export const _toggleRaidSolution = ({toggle}: IToggleRaidHelper) => toggle.raid.solution;

export const _toggleRaidCompact = ({toggle}: IToggleRaidHelper) => toggle.raid.compact;

interface IToggleCalculator {
  toggle: IUserToggle;
}

export const _toggleCalculatorClaim = ({toggle}: IToggleCalculator) =>
  toggle.calculator.all && toggle.calculator.claim;

export const _toggleCalculatorInventory = ({toggle}: IToggleCalculator) =>
  toggle.calculator.all && toggle.calculator.inventory;

export const _toggleAutoSendOnProfile = ({toggle}: IToggleCalculator) => toggle.autoSend.profile;