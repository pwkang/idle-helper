import type {IChecker} from './type';

const isSuccessfulAssigned = (content: string) =>
  content.includes('successfully assigned to farm');

const invalidFarmId = ({message, author}: IChecker) =>
  message.mentions.users.has(author.id) &&
  message.content.includes('Wrong farm ID');

const invalidWorkerType = ({message, author}: IChecker) =>
  message.mentions.users.has(author.id) &&
  message.content.includes('Wrong worker type');

export const _workerAssignChecker = {
  isSuccessfulAssigned,
  invalidFarmId,
  invalidWorkerType
};
