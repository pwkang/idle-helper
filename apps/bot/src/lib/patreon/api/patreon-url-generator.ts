// let patreonListUrl = `https://www.patreon.com/api/oauth2/v2/campaigns/${ campaign_id }/members?page%5Bcount%5D=200&include=currently_entitled_tiers,user,campaign,address&fields%5Bmember%5D=last_charge_date,last_charge_status,lifetime_support_cents,currently_entitled_amount_cents,patron_status,pledge_relationship_start,next_charge_date,email&fields%5Buser%5D=social_connections`;

import {
  PATREON_CAMPAIGN_ATTRIBUTES,
  PATREON_MEMBER_ATTRIBUTES,
  PATREON_TIER_ATTRIBUTES,
  PATREON_USER_ATTRIBUTES,
} from '../patreon.constant';

interface IGenerateFetchPatreonApiUrl {
  campaignId: string;
  count?: number;
  include?: {
    member?: ValuesOf<typeof PATREON_MEMBER_ATTRIBUTES>[];
    user?: ValuesOf<typeof PATREON_USER_ATTRIBUTES>[];
    campaign?: ValuesOf<typeof PATREON_CAMPAIGN_ATTRIBUTES>[];
    currently_entitled_tiers?: ValuesOf<typeof PATREON_TIER_ATTRIBUTES>[];
  };
  nextCursor?: string;
}

const generateFetchPatreonApiUrl = ({
  campaignId,
  include = {},
  count = 10,
  nextCursor,
}: IGenerateFetchPatreonApiUrl) => {
  const baseUrl = `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members`;
  const {member, campaign, user, currently_entitled_tiers} = include;
  const params = new URLSearchParams({
    'page[count]': String(count),
    include: 'currently_entitled_tiers,user',
  });

  if (member?.length) params.append('fields[member]', member.join(','));

  if (campaign?.length) params.append('fields[campaign]', campaign.join(','));

  if (user?.length) params.append('fields[user]', user.join(','));

  if (currently_entitled_tiers?.length)
    params.append('fields[currently_entitled_tiers]', currently_entitled_tiers.join(','));

  if (nextCursor) params.append('page[cursor]', nextCursor);

  return `${baseUrl}?${params.toString()}`;
};

interface IGenerateFetchCampaignUrl {
  include?: {
    tiers?: ValuesOf<typeof PATREON_TIER_ATTRIBUTES>[];
    campaign?: ValuesOf<typeof PATREON_CAMPAIGN_ATTRIBUTES>[];
    user?: ValuesOf<typeof PATREON_USER_ATTRIBUTES>[];
  };
}

const generateFetchCampaignUrl = ({include = {}}: IGenerateFetchCampaignUrl) => {
  const baseUrl = 'https://www.patreon.com/api/oauth2/v2/campaigns';
  const params = new URLSearchParams({
    include: 'tiers,creator',
  });
  const {tiers, campaign} = include;

  if (tiers?.length) params.append('fields[tier]', tiers.join(','));

  if (campaign?.length) params.append('fields[campaign]', campaign.join(','));

  if (include.user?.length) params.append('fields[user]', include.user.join(','));

  return `${baseUrl}?${params.toString()}`;
};

const patreonUrlGenerator = {
  generateFetchPatreonApiUrl,
  generateFetchCampaignUrl,
};

export default patreonUrlGenerator;
