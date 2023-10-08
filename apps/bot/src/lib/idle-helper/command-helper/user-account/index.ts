import {_registerAccount} from './register-account';
import {_turnOnAccount} from './account-on';
import {_turnOffAccount} from './account-off';
import {_deleteAccount} from './account-delete';
import {_accountSettings} from './account-settings';
import {_claimReminder} from './claim-reminder';
import {_reminderChannel} from './reminder-channel';
import {_setDonor} from './set-donor';

export const _userAccountHelper = {
  register: _registerAccount,
  turnOnAccount: _turnOnAccount,
  turnOffAccount: _turnOffAccount,
  deleteAccount: _deleteAccount,
  settings: _accountSettings,
  claimReminder: _claimReminder,
  reminderChannel: _reminderChannel,
  setDonor: _setDonor
};
