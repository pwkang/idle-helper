import {_workerReader} from './workers';
import {_raidReader} from './raid';
import {_guildReader} from './guild';

const messageReaders = {
  worker: _workerReader,
  raid: _raidReader,
  guild: _guildReader,
};

export default messageReaders;
