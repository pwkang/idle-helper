import {ValuesOf} from '../type';

export const DONOR_TIER = {} as const;

type TDonorTier = ValuesOf<typeof DONOR_TIER>;

export const DONOR_TOKEN_AMOUNT: Record<TDonorTier, number> = {} as const;

export const DONOR_TIER_ID: Record<TDonorTier, string> = {} as const;
