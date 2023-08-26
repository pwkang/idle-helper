import {userService} from '../../../../services/database/user.service';
import {
  _toggleCalculatorClaim,
  _toggleCalculatorInventory,
  _toggleClaimReminder,
  _toggleRaidHelper,
} from './toggle-user-checker-list';

interface IToggleUserChecker {
  userId: string;
}

export type IToggleUserCheckerReturnType = Awaited<ReturnType<typeof toggleUserChecker>>;

const toggleUserChecker = async ({userId}: IToggleUserChecker) => {
  const userAccount = await userService.findUser({userId});
  if (!userAccount?.toggle) return null;
  const userToggle = userAccount.toggle;
  
  return {
    reminder: {
      claim: _toggleClaimReminder({toggle: userToggle}),
    },
    raidHelper: _toggleRaidHelper({toggle: userToggle}),
    calculator: {
      claim: _toggleCalculatorClaim({toggle: userToggle}),
      inventory: _toggleCalculatorInventory({toggle: userToggle}),
    },
  };
};

export default toggleUserChecker;
