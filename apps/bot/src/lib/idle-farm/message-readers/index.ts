import {_workerReader} from './workers';
import {_raidReader} from './raid';
import {_guildReader} from './guild';
import {_guildListReader} from './guild-list';
import {_marketReader} from './market';
import {_inventoryReader} from './inventory';
import {_claimReader} from './claim';
import {_teamRaidReader} from './team-raid';
import {_profileReader} from './profile';

const messageReaders = {
  worker: _workerReader,
  raid: _raidReader,
  guild: _guildReader,
  guildList: _guildListReader,
  market: _marketReader,
  inventory: _inventoryReader,
  claim: _claimReader,
  teamRaid: _teamRaidReader,
  profile: _profileReader,
};

export default messageReaders;
