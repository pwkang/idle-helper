import {IUserToggle} from '@idle-helper/models';

interface IToggleClaimReminder {
  toggle: IUserToggle;
}

export const _toggleClaimReminder = ({toggle}: IToggleClaimReminder) => toggle.reminder.claim;

interface IToggleRaidHelper {
  toggle: IUserToggle;
}

export const _toggleRaidHelper = ({toggle}: IToggleRaidHelper) => toggle.raidHelper;

interface IToggleCalculator {
  toggle: IUserToggle;
}

export const _toggleCalculatorClaim = ({toggle}: IToggleCalculator) =>
  toggle.calculator.all && toggle.calculator.claim;

export const _toggleCalculatorInventory = ({toggle}: IToggleCalculator) =>
  toggle.calculator.all && toggle.calculator.inventory;
