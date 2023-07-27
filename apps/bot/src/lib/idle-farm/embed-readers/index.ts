import {_workerReader} from './workers';
import {_raidReader} from './raid';

const embedReaders = {
  worker: _workerReader,
  raid: _raidReader,
};

export default embedReaders;
