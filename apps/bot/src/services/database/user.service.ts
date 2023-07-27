import {mongoClient} from '@idle-helper/services';
import {IUser, IUserWorker, userSchema} from '@idle-helper/models';
import {IDLE_FARM_WORKER_TYPE, IDLE_FARM_FARM_TYPE} from '@idle-helper/constants';
import {UpdateQuery} from 'mongoose';

const dbUser = mongoClient.model<IUser>('users', userSchema);

interface IRegisterUser {
  userId: string;
  username: string;
}

const registerUser = async ({userId, username}: IRegisterUser): Promise<boolean> => {
  const user = await dbUser.findOne({userId});

  if (!user) {
    const newUser = new dbUser({
      userId,
      username,
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
  const user = await dbUser.findOneAndUpdate({userId}, {
    $set: {
      'farms.lastClaimedAt': new Date(),
    },
  }, {
    new: true,
  });

  return user ?? null;
};

interface IWorker {
  type: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
  level: number;
  maxExp: number;
  exp: number;
  power: number;
  farm: keyof typeof IDLE_FARM_FARM_TYPE;
}

interface ISaveUserWorkers {
  userId: string;
  workers: IWorker[];
}

const saveUserWorkers = async ({userId, workers}: ISaveUserWorkers): Promise<IUser | null> => {
  const query: UpdateQuery<IUser> = {};
  for (const worker of workers) {
    query[`workers.${worker.type}`] = {
      exp: worker.exp,
      farm: worker.farm,
      maxExp: worker.maxExp,
      power: worker.power,
      level: worker.level,
    } as IUserWorker;
  }
  const user = await dbUser.findOneAndUpdate({userId}, {
    $set: query,
  }, {
    new: true,
  });
  return user ?? null;
};

interface IGetUserWorkers {
  userId: string;
}

const getUserWorkers = async ({userId}: IGetUserWorkers): Promise<IUser['workers']> => {
  const user = await dbUser.findOne({userId});
  return user?.workers ?? {} as IUser['workers'];
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
};