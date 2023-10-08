import {userService} from '../../../services/database/user.service';
import {typedObjectEntries} from '@idle-helper/utils';
import {
  IDLE_FARM_WORKER_TYPE,
  IDLE_FARM_WORKERS_LEVEL_AMOUNT
} from '@idle-helper/constants';
import {infoService} from '../../../services/database/info.service';

export const _updateWorkerLeaderboard = async () => {
  for (const [worker] of typedObjectEntries(IDLE_FARM_WORKER_TYPE)) {
    const users = await userService.getTopWorkers({
      type: worker,
      limit: 75
    });
    await infoService.updateLeaderboard({
      type: worker,
      values: users.map((user) => ({
        name: user.username,
        value: `Level ${user.workers[worker].level} \`[${
          user.workers[worker].amount
        }/${
          IDLE_FARM_WORKERS_LEVEL_AMOUNT[user.workers[worker].level + 1] ??
          '???'
        }]\``
      }))
    });
  }
};
