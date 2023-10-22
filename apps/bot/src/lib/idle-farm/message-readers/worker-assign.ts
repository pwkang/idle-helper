import {typedObjectEntries} from '@idle-helper/utils';
import {IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';

interface IWorkerAssignReader {
  content: string;
}

export const _workerAssignReader = ({content}: IWorkerAssignReader) => {
  const farmId = content.match(/farm `(\d+)`/)?.[1] ?? '0';
  const workerType = content.match(/`(.*) worker` successfully/)?.[1];
  const replacedWorker = content.match(/replaced <.+> `(.*) worker`/)?.[1];

  return {
    farmId,
    workerType: typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(([, value]) =>
      workerType === value
    )?.[0],
    replacedWorker: typedObjectEntries(IDLE_FARM_WORKER_TYPE).find(
      ([, value]) => replacedWorker === value
    )?.[0]
  };
};
