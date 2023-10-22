import {_profileChecker} from './profile-checker';
import {_inventoryChecker} from './inventory-checker';
import {_packingChecker} from './packing-checker';
import {_sellChecker} from './sell-checker';
import {_buyChecker} from './buy-checker';
import {_claimChecker} from './claim-checker';
import {_farmChecker} from './farm-checker';
import {_workerAssignChecker} from './worker-assign-checker';

export const messageChecker = {
  profile: _profileChecker,
  inventory: _inventoryChecker,
  packing: _packingChecker,
  sell: _sellChecker,
  buy: _buyChecker,
  claim: _claimChecker,
  farm: _farmChecker,
  workerAssign: _workerAssignChecker
};
