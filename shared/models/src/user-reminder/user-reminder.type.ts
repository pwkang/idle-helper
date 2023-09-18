import {IDLE_FARM_REMINDER_TYPE} from '@idle-helper/constants';

type BaseUserReminder = {
  userId: string;
  readyAt?: Date;
};

type VoteReminderProps = {
  type: typeof IDLE_FARM_REMINDER_TYPE.vote;
} & BaseUserReminder;

type ClaimReminderProps = {
  type: typeof IDLE_FARM_REMINDER_TYPE.claim;
} & BaseUserReminder;


export type IUserReminder = VoteReminderProps | ClaimReminderProps;
