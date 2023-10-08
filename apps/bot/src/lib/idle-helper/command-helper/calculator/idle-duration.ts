import type {IUser} from '@idle-helper/models';
import {IDLE_FARM_TIME_BOOSTER_DURATION} from '@idle-helper/constants';

export const _idleDurationCalculator = (userAccount: IUser) => {
  const timeSpeederUsed = userAccount.farms.itemsUsed.timeSpeeder ?? 0;
  const timeCompressorUsed = userAccount.farms.itemsUsed.timeCompressor ?? 0;

  const extraTime =
    IDLE_FARM_TIME_BOOSTER_DURATION.timeSpeeder * timeSpeederUsed +
    IDLE_FARM_TIME_BOOSTER_DURATION.timeCompressor * timeCompressorUsed;

  return Date.now() - userAccount.farms.lastClaimedAt.getTime() + extraTime;
};
