import {mongoClient} from '@idle-helper/services';
import {IUser, IUserToggle, IUserWorker, userSchema} from '@idle-helper/models';
import {IDLE_FARM_DONOR_TIER} from '@idle-helper/constants';
import {UpdateQuery} from 'mongoose';

const dbUser = mongoClient.model<IUser>('users', userSchema);

interface IRegisterUser {
  userId: string;
  username: string;
  channelId: string;
}

const registerUser = async ({userId, username, channelId}: IRegisterUser): Promise<boolean> => {
  const user = await dbUser.findOne({userId});

  if (!user) {
    const newUser = new dbUser({
      userId,
      username,
      config: {
        channelId,
      },
    });

    await newUser.save();
    return true;
  }
  return false;
};

interface IFindUser {
  userId: string;
}

const findUser = async ({userId}: IFindUser): Promise<IUser | null> => {
  const user = await dbUser.findOne({userId});

  return user ?? null;
};

interface IDeleteUser {
  userId: string;
}

const deleteUser = async ({userId}: IDeleteUser): Promise<void> => {
  await dbUser.findOneAndDelete({userId});
};

interface ITurnOffAccount {
  userId: string;
}

const turnOffAccount = async ({userId}: ITurnOffAccount): Promise<void> => {
  const user = await dbUser.findOne({userId});
  if (!user) return;

  user.config.onOff = false;
  await user.save();
};

interface ITurnOnAccount {
  userId: string;
}

const turnOnAccount = async ({userId}: ITurnOnAccount): Promise<void> => {
  const user = await dbUser.findOne({userId});
  if (!user) return;

  user.config.onOff = true;
  await user.save();
};

interface IClaimFarm {
  userId: string;
}

const claimFarm = async ({userId}: IClaimFarm): Promise<IUser | null> => {
  const user = await dbUser.findOneAndUpdate(
    {userId},
    {
      $set: {
        'farms.lastClaimedAt': new Date(),
      },
    },
    {
      new: true,
    },
  );

  return user ?? null;
};


interface ISaveUserWorkers {
  userId: string;
  workers: IUserWorker[];
}

const saveUserWorkers = async ({userId, workers}: ISaveUserWorkers): Promise<IUser | null> => {
  const query: UpdateQuery<IUser> = {
    'lastUpdated.workers': new Date(),
  };
  for (const worker of workers) {
    query[`workers.${worker.type}`] = {
      exp: worker.exp,
      farm: worker.farm,
      maxExp: worker.maxExp,
      power: worker.power,
      level: worker.level,
      amount: worker.amount,
      type: worker.type,
    } as IUserWorker;
  }
  const user = await dbUser.findOneAndUpdate(
    {userId},
    {
      $set: query,
    },
    {
      new: true,
    },
  );
  return user ?? null;
};

interface IGetUserWorkers {
  userId: string;
}

const getUserWorkers = async ({userId}: IGetUserWorkers): Promise<IUser['workers']> => {
  const user = await dbUser.findOne({userId});
  return user?.workers ?? ({} as IUser['workers']);
};

interface ISetClaimReminders {
  userId: string;
  reminderHours: number[];
}

const setClaimReminders = async ({
  userId,
  reminderHours,
}: ISetClaimReminders): Promise<IUser | null> => {
  const user = await dbUser.findOneAndUpdate(
    {userId},
    {
      $set: {
        'farms.reminderHours': reminderHours,
      },
    },
    {
      new: true,
    },
  );
  return user ?? null;
};

interface IUpdateReminderChannel {
  userId: string;
  channelId: string;
}

const updateReminderChannel = async ({
  userId,
  channelId,
}: IUpdateReminderChannel): Promise<IUser | null> => {
  const user = await dbUser.findOneAndUpdate(
    {userId},
    {
      $set: {
        'config.channelId': channelId,
      },
    },
    {
      new: true,
    },
  );
  return user ?? null;
};

interface IGetUserToggle {
  userId: string;
}

const getUserToggle = async ({userId}: IGetUserToggle): Promise<IUserToggle> => {
  const user = await dbUser.findOne({userId});
  return user?.toggle ?? ({} as IUserToggle);
};

interface IUpdateUserToggle {
  userId: string;
  query: UpdateQuery<IUser>;
}

const updateUserToggle = async ({userId, query}: IUpdateUserToggle): Promise<IUser | null> => {
  const user = await dbUser.findOneAndUpdate({userId}, query, {
    new: true,
  });
  return user ?? null;
};

interface IResetUserToggle {
  userId: string;
}

const resetUserToggle = async ({userId}: IResetUserToggle): Promise<IUser | null> => {
  const user = await dbUser.findOneAndUpdate(
    {userId},
    {
      $unset: {
        toggle: '',
      },
    },
    {
      new: true,
    },
  );
  return user ?? null;
};

interface IGetUsersById {
  userIds: string[];
}

const getUsersById = async ({userIds}: IGetUsersById): Promise<IUser[]> => {
  const users = await dbUser.find({
    userId: {
      $in: userIds,
    },
  });
  return users;
};

interface IUpdateIdleFarmDonorTier {
  userId: string;
  tier: ValuesOf<typeof IDLE_FARM_DONOR_TIER>;
}

const updateIdleFarmDonorTier = async ({tier, userId}: IUpdateIdleFarmDonorTier) => {
  const user = await dbUser.findOneAndUpdate(
    {userId},
    {
      $set: {
        'config.donorTier': tier,
      },
    },
    {
      new: true,
    },
  );
  return user ?? null;
};
export const userService = {
  registerUser,
  findUser,
  deleteUser,
  turnOffAccount,
  turnOnAccount,
  claimFarm,
  saveUserWorkers,
  getUserWorkers,
  setClaimReminders,
  updateReminderChannel,
  getUserToggle,
  updateUserToggle,
  resetUserToggle,
  getUsersById,
  updateIdleFarmDonorTier,
};
