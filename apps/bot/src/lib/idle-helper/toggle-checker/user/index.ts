import {userService} from '../../../../services/database/user.service';

interface IToggleUserChecker {
  userId: string;
}

export type IToggleUserCheckerReturnType = Awaited<ReturnType<typeof toggleUserChecker>>;

const toggleUserChecker = async ({userId}: IToggleUserChecker) => {
  const userToggle = await userService.getUserToggle({userId});
  if (!userToggle) return null;

  return {};
};

export default toggleUserChecker;
