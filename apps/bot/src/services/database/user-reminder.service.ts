import {redisUserReminder} from '../redis/user-reminder.redis';
import {Model} from 'mongoose';
import {IUserReminder, userReminderSchema} from '@idle-helper/models';
import {mongoClient} from '@idle-helper/services';
import {IDLE_FARM_REMINDER_TYPE} from '@idle-helper/constants';

userReminderSchema.post('findOneAndUpdate', async function() {
  const updatedUserId = this.getQuery().userId;
  await updateNextReminderTime(updatedUserId, this.model);
});

userReminderSchema.post('deleteMany', async function() {
  const deletedUserId = this.getQuery().userId;
  await updateNextReminderTime(deletedUserId, this.model);
});

userReminderSchema.post('updateMany', async function() {
  const updatedUserId = this.getQuery().userId;
  await updateNextReminderTime(updatedUserId, this.model);
});

async function updateNextReminderTime(userId: string, model: Model<IUserReminder>) {
  const nextReminderTime = await model
    .find({
      userId,
      readyAt: {$gt: new Date()},
    })
    .sort({readyAt: 1})
    .limit(1);
  if (nextReminderTime.length && nextReminderTime[0].readyAt)
    await redisUserReminder.setReminderTime(userId, nextReminderTime[0].readyAt);
  else await redisUserReminder.deleteReminderTime(userId);
}

const dbUserReminder = mongoClient.model<IUserReminder>('user-reminder', userReminderSchema);

interface ISaveUserVoteCooldown {
  userId: string;
  readyAt?: Date;
}

const saveUserVoteCooldown = async ({
  userId,
  readyAt,
}: ISaveUserVoteCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: IDLE_FARM_REMINDER_TYPE.vote,
    },
    {
      $set: {
        readyAt,
      },
    },
    {
      upsert: true,
    },
  );
};

interface ISaveUserClaimCooldown {
  userId: string;
  readyAt?: Date;
}

const saveUserClaimCooldown = async ({
  userId,
  readyAt,
}: ISaveUserClaimCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: IDLE_FARM_REMINDER_TYPE.claim,
    },
    {
      $set: {
        readyAt,
      },
    },
    {
      upsert: true,
    },
  );
};

interface IUpdateUserCooldown {
  userId: string;
  type: ValuesOf<typeof IDLE_FARM_REMINDER_TYPE>;
  readyAt?: Date;
}

const updateUserCooldown = async ({userId, readyAt, type}: IUpdateUserCooldown) => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type,
    },
    {
      $set: {
        readyAt,
      },
    },
    {
      upsert: true,
    },
  );
};

interface IDeleteUserCooldown {
  userId: string;
  types: ValuesOf<typeof IDLE_FARM_REMINDER_TYPE>[];
}

const deleteUserCooldowns = async ({userId, types}: IDeleteUserCooldown) => {
  await dbUserReminder.deleteMany({
    userId,
    type: {$in: types},
  });
};

const findUserReadyCommands = async (userId: string): Promise<IUserReminder[]> => {
  const reminderList = await dbUserReminder.find({
    userId,
    readyAt: {$lte: new Date()},
  });

  return reminderList ? reminderList.map((reminder) => reminder.toObject()) : [];
};

const getUserAllCooldowns = async (userId: string): Promise<IUserReminder[]> => {
  const reminderList = await dbUserReminder.find({
    userId,
  });

  return reminderList ? reminderList.map((reminder) => reminder.toObject()) : [];
};

const clearUserCooldowns = async (userId: string): Promise<void> => {
  await dbUserReminder.deleteMany({
    userId,
  });
};

interface IGetNextReadyCommand {
  userId: string;
}

const getNextReadyCommand = async ({
  userId,
}: IGetNextReadyCommand): Promise<IUserReminder | null> => {
  const reminder = await dbUserReminder.find(
    {
      userId,
      readyAt: {$gte: new Date()},
    },
    null,
    {
      sort: {
        readyAt: 1,
      },
      limit: 1,
    },
  );
  return reminder?.length ? reminder[0].toObject() : null;
};

interface IUpdateRemindedCooldowns {
  userId: string;
  types: ValuesOf<typeof IDLE_FARM_REMINDER_TYPE>[];
}

const updateRemindedCooldowns = async ({userId, types}: IUpdateRemindedCooldowns) => {
  await dbUserReminder.updateMany(
    {
      userId,
      type: {$in: types},
    },
    {
      $unset: {
        readyAt: 1,
      },
    },
  );
};

interface IFindUserCooldown {
  userId: string;
  type: ValuesOf<typeof IDLE_FARM_REMINDER_TYPE>;
}

const findUserCooldown = async ({
  userId,
  type,
}: IFindUserCooldown): Promise<IUserReminder | null> => {
  const reminder = await dbUserReminder.findOne({
    userId,
    type,
  });

  return reminder ? reminder.toObject() : null;
};

export const userReminderServices = {
  saveUserVoteCooldown,
  saveUserClaimCooldown,
  updateUserCooldown,
  deleteUserCooldowns,
  findUserReadyCommands,
  getUserAllCooldowns,
  clearUserCooldowns,
  getNextReadyCommand,
  updateRemindedCooldowns,
  findUserCooldown,
};
