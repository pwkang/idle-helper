import {_workerReader} from './workers';
import {_raidReader} from './raid';

const messageReaders = {
  worker: _workerReader,
  raid: _raidReader,
};

export default messageReaders;
