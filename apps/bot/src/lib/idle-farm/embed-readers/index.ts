import {_workerReader} from './workers';
import {_raidReader} from './raid';
import {_guildReader} from './guild';
import {_guildListReader} from './guild-list';
import {_marketReader} from './market';

const messageReaders = {
  worker: _workerReader,
  raid: _raidReader,
  guild: _guildReader,
  guildList: _guildListReader,
  market: _marketReader,
};

export default messageReaders;
