import {IDLE_FARM_DONOR_TIER} from './bot';

export const TAX_RATE_COMMON = {
  [IDLE_FARM_DONOR_TIER.nonDonor]: 0.8,
  [IDLE_FARM_DONOR_TIER.common]: 0.8,
  [IDLE_FARM_DONOR_TIER.talented]: 0.8,
  [IDLE_FARM_DONOR_TIER.wise]: 0.9
} as const;

export const TAX_RATE_BOX = {
  [IDLE_FARM_DONOR_TIER.nonDonor]: 0.9,
  [IDLE_FARM_DONOR_TIER.common]: 0.9,
  [IDLE_FARM_DONOR_TIER.talented]: 0.9,
  [IDLE_FARM_DONOR_TIER.wise]: 0.95
} as const;

export const TAX_RATE_LABEL = {
  0.8: '20%',
  0.9: '10%',
  0.95: '5%'
} as const;
