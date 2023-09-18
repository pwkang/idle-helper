import {Schema} from 'mongoose';
import {IUserReminder} from './user-reminder.type';

export const userReminderSchema = new Schema<IUserReminder>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {type: String, required: true},
    readyAt: {type: Date},
  },
  {
    statics: {
      findNextReadyAt(userId: string) {
        return this.find({userId, readyAt: {$gt: new Date()}})
          .sort({readyAt: 1})
          .limit(1);
      },
    },
  },
);
