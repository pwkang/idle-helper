import {userService} from '../../../../services/database/user.service';
import {
  _toggleAutoSendOnProfile,
  _toggleCalculatorClaim,
  _toggleCalculatorInventory,
  _toggleClaimReminder,
  _toggleDailyReminder,
  _toggleRaidCompact,
  _toggleRaidHelper,
  _toggleRaidSolution,
  _toggleVoteReminder
} from './toggle-user-checker-list';

interface IToggleUserChecker {
  userId: string;
}

export type IToggleUserCheckerReturnType = Awaited<
  ReturnType<typeof toggleUserChecker>
>;

const toggleUserChecker = async ({userId}: IToggleUserChecker) => {
  const userAccount = await userService.findUser({userId});
  if (!userAccount?.toggle) return null;
  const userToggle = userAccount.toggle;

  return {
    reminder: {
      claim: _toggleClaimReminder({toggle: userToggle}),
      vote: _toggleVoteReminder({toggle: userToggle}),
      daily: _toggleDailyReminder({toggle: userToggle})
    },
    raid: {
      helper: _toggleRaidHelper({toggle: userToggle}),
      solution: _toggleRaidSolution({toggle: userToggle}),
      compact: _toggleRaidCompact({toggle: userToggle})
    },
    calculator: {
      claim: _toggleCalculatorClaim({toggle: userToggle}),
      inventory: _toggleCalculatorInventory({toggle: userToggle})
    },
    autoSend: {
      profile: _toggleAutoSendOnProfile({toggle: userToggle})
    }
  };
};

export default toggleUserChecker;
