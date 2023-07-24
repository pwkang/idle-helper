import {
  IFetchPatreonCampaignMembersResponse,
  IFetchPatreonCampaignResponse,
  IIncludeItem,
  IUserAttributes,
} from '../type';
import {
  PATREON_INCLUDE_TYPE,
  PATREON_PATRON_STATUS,
  PATREON_PAYMENT_STATUS,
} from '../patreon.constant';
import {DONOR_TIER, DONOR_TIER_ID} from '@idle-helper/constants';
import {typedObjectEntries} from '@idle-helper/utils';

interface ITier {
  id: string;
  amountCents?: number;
  discordRoleIds?: string[];
  totalPatrons?: number;
  title?: string;
}

interface ICampaignInfo {
  totalPatrons?: number;
  tiers: ITier[];
}

export const toCampaignInfo = (
  response: Pick<IFetchPatreonCampaignResponse, 'data' | 'included'>
): ICampaignInfo[] => {
  const campaignInfo: ICampaignInfo[] = [];

  for (let campaign of response.data) {
    const tiers: ITier[] = [];
    for (let tier of campaign.relationships.tiers.data) {
      const includedTier = response.included.find((i) => i.id === tier.id);
      if (includedTier) {
        tiers.push({
          id: tier.id,
          amountCents: includedTier.attributes.amount_cents,
          discordRoleIds: includedTier.attributes.discord_role_ids,
          totalPatrons: includedTier.attributes.patron_count,
          title: includedTier.attributes.title,
        });
      }
    }
    campaignInfo.push({
      totalPatrons: campaign.attributes.patron_count,
      tiers,
    });
  }
  return campaignInfo;
};

interface IPatron {
  subscription: {
    lastChargeDate?: Date;
    lastChargeStatus?: ValuesOf<typeof PATREON_PAYMENT_STATUS>;
    lifetimeSupportCents?: number;
    nextChargeDate?: Date;
    patronStatus?: ValuesOf<typeof PATREON_PATRON_STATUS>;
    pledgeRelationshipStart?: Date;
  };
  currentTier?: ValuesOf<typeof DONOR_TIER>;
  discord: {
    userId?: string;
  };
  patreon: {
    memberId: string;
    userId: string;
    email?: string;
    fullName?: string;
  };
}

export const toPatrons = (
  response: Pick<IFetchPatreonCampaignMembersResponse, 'data' | 'included'>
): IPatron[] => {
  const patrons: IPatron[] = [];
  for (let member of response.data) {
    const userAttributes = response.included.find(
      (i) => i.type === PATREON_INCLUDE_TYPE.user && i.id === member.relationships.user.data.id
    ) as IIncludeItem<IUserAttributes> | undefined;
    const lastChargeDate = member.attributes.last_charge_date;
    const lastChargeStatus = member.attributes.last_charge_status;
    const lifetimeSupportCents = member.attributes.lifetime_support_cents;
    const nextChargeDate = member.attributes.next_charge_date;
    const patronStatus = member.attributes.patron_status;
    const pledgeRelationshipStart = member.attributes.pledge_relationship_start;
    const currentTierId = member.relationships.currently_entitled_tiers.data[0]?.id;
    const discordUserId = userAttributes?.attributes.social_connections?.discord?.user_id;
    const patronUserId = member.relationships.user.data.id;
    const patronEmail = userAttributes?.attributes.email;
    const patronFullName = userAttributes?.attributes.full_name;

    const patron: IPatron = {
      subscription: {
        lastChargeDate: lastChargeDate ? new Date(lastChargeDate) : undefined,
        lastChargeStatus,
        lifetimeSupportCents,
        nextChargeDate: nextChargeDate ? new Date(nextChargeDate) : undefined,
        patronStatus,
        pledgeRelationshipStart: pledgeRelationshipStart
          ? new Date(pledgeRelationshipStart)
          : undefined,
      },
      currentTier: currentTierId
        ? typedObjectEntries(DONOR_TIER_ID).find(([, v]) => v === currentTierId)?.[0]
        : undefined,
      discord: {
        userId: discordUserId ?? undefined,
      },
      patreon: {
        memberId: member.id,
        userId: patronUserId,
        email: patronEmail ?? undefined,
        fullName: patronFullName ?? undefined,
      },
    };
    patrons.push(patron);
  }

  return patrons;
};
