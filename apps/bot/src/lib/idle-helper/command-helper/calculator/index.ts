import {_inventoryCalculator} from './inventory-calculator';
import {_claimCalculator} from './claim-calculator';
import {_idleDurationCalculator} from './idle-duration';

export const _calculatorHelper = {
  inventory: _inventoryCalculator,
  claim: _claimCalculator,
  idleDuration: _idleDurationCalculator
};
