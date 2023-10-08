import {_profileChecker} from './profile-checker';
import {_inventoryChecker} from './inventory-checker';
import {_packingChecker} from './packing-checker';
import {_sellChecker} from './sell-checker';
import {_buyChecker} from './buy-checker';

export const messageChecker = {
  profile: _profileChecker,
  inventory: _inventoryChecker,
  packing: _packingChecker,
  sell: _sellChecker,
  buy: _buyChecker
};
