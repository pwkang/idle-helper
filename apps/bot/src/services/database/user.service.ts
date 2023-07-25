import {mongoClient} from '@idle-helper/services';
import {IUser, userSchema} from '@idle-helper/models';

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

export const userService = {
  registerUser,
  findUser,
  deleteUser,
  turnOffAccount,
  turnOnAccount,
};