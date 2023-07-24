import {
  PATREON_INCLUDE_TYPE,
  PATREON_PATRON_STATUS,
  PATREON_PAYMENT_STATUS,
  PATREON_PLEDGE_TYPE,
  PATREON_SOCIAL_CONNECTIONS_TYPE,
} from './patreon.constant';

export interface IFetchPatreonCampaignMembersResponse {
  data: IPatreonMember[];
  included: IIncludeItem<IUserAttributes | ITierAttributes | ICampaignAttributes>[];
  links: IPatreonResponseLinks;
  meta: IPatreonResponseMeta;
}

export interface IFetchPatreonCampaignResponse {
  data: ICampaign[];
  included: {
    attributes: ITierAttributes;
    id: string;
    type: string;
  }[];
  meta: IPatreonResponseMeta;
}

interface ICampaign {
  attributes: ICampaignAttributes;
  id: string;
  relationships: {
    tiers: {
      data: {
        id: string;
        type: string;
      }[];
    };
  };
}

interface IPatreonResponseLinks {
  next: string;
}

export interface IPatreonResponseMeta {
  pagination: {
    cursors: {
      next: string | null;
    };
    total: number;
  };
}

// patreon user data
export interface IIncludeItem<T> {
  attributes: T;
  id: string;
  type: IPatreonIncludeType;
}

// patreon member data

interface IPatreonMember {
  attributes: IMemberAttributes;
  id: string;
  relationships: {
    address: {
      data: string | null;
    };
    campaign: {
      data: {
        id: string;
        type: string;
      };
      links: {
        related: string;
      };
    };
    currently_entitled_tiers: {
      data: {
        id: string;
        type: string;
      }[];
    };
    user: {
      data: {
        id: string;
        type: string;
      };
      links: {
        related: string;
      };
    };
  };
  type: string;
}

// Refer to: https://docs.patreon.com/#user-v2
export interface IUserAttributes {
  about?: string;
  can_see_nsfw?: boolean;
  created?: string;
  email?: string;
  first_name?: string;
  full_name?: string;
  hide_pledges?: boolean;
  image_url?: string;
  is_email_verified?: boolean;
  last_name?: string;
  like_count?: number;
  social_connections?: Partial<
    Record<
      ValuesOf<typeof PATREON_SOCIAL_CONNECTIONS_TYPE>,
      {
        url: any;
        user_id: string;
      }
    >
  >;
  thumb_url?: string;
  url?: string;
  vanity?: string;
}

// Refer to: https://docs.patreon.com/#campaign-v2
interface ICampaignAttributes {
  created_at?: string;
  creation_name?: string;
  discord_server_id?: string;
  google_analytics_id?: string;
  has_rss?: boolean;
  has_sent_rss_notify?: boolean;
  image_small_url?: string;
  image_url?: string;
  is_charged_immediately?: boolean;
  is_monthly?: boolean;
  is_nsfw?: boolean;
  main_video_embed?: string;
  main_video_url?: string;
  one_liner?: string;
  patron_count?: number;
  pay_per_name?: string;
  pledge_url?: string;
  published_at?: string;
  rss_artwork_url?: string;
  rss_feed_title?: string;
  show_earnings?: boolean;
  summary?: string;
  thanks_embed?: string;
  thanks_msg?: string;
  thanks_video_url?: string;
  url?: string;
  vanity?: string;
}

// Refer to: https://docs.patreon.com/#tier
interface ITierAttributes {
  amount_cents?: number;
  created_at?: string;
  description?: string;
  discord_role_ids?: string[];
  edited_at?: string;
  image_url?: string;
  patron_count?: number;
  post_count?: number;
  published?: boolean;
  published_at?: string;
  remaining?: number;
  requires_shipping?: boolean;
  title?: string;
  unpublished_at?: string;
  url?: string;
  user_limit?: number;
}

// Refer to: https://docs.patreon.com/#member
interface IMemberAttributes {
  campaign_lifetime_support_cents?: number;
  currently_entitled_amount_cents?: number;
  email?: string;
  full_name?: string;
  is_follower?: boolean;
  last_charge_date?: string;
  last_charge_status?: TPaymentStatus;
  lifetime_support_cents?: number;
  next_charge_date?: string;
  note?: string;
  patron_status?: TPatronStatus;
  pledge_cadence?: string;
  pledge_relationship_start?: string;
  will_pay_amount_cents?: number;
}

// Refer to: https://docs.patreon.com/#member
interface IMemberRelationships {
  address?: IAddressAttributes;
  campaign?: ICampaignAttributes;
  currently_entitled_tiers?: ITierAttributes[];
  pledge_history?: IPledge[];
  user?: IUserAttributes;
}

interface IAddressAttributes {
  addressee?: string;
  city?: string;
  country?: string;
  created_at?: string;
  line_1?: string;
  line_2?: string;
  phone_number?: string;
  postal_code?: string;
  state?: string;
}

interface IPledge {
  amount_cents?: number;
  currency_code?: string;
  date?: string;
  payment_status?: TPaymentStatus;
  tier_id?: string;
  tier_title?: string;
  type?: TPledgeType;
}

type TPaymentStatus = ValuesOf<typeof PATREON_PAYMENT_STATUS>;

type TPatronStatus = ValuesOf<typeof PATREON_PATRON_STATUS>;

type TPledgeType = ValuesOf<typeof PATREON_PLEDGE_TYPE>;

type IPatreonIncludeType = ValuesOf<typeof PATREON_INCLUDE_TYPE>;
