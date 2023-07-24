export const PATREON_USER_ATTRIBUTES = {
  about: 'about',
  canSeeNsfw: 'can_see_nsfw',
  created: 'created',
  email: 'email',
  firstName: 'first_name',
  fullName: 'full_name',
  hidePledges: 'hide_pledges',
  imageUrl: 'image_url',
  isEmailVerified: 'is_email_verified',
  lastName: 'last_name',
  likeCount: 'like_count',
  socialConnections: 'social_connections',
  thumbUrl: 'thumb_url',
  url: 'url',
  vanity: 'vanity',
} as const;

export const PATREON_CAMPAIGN_ATTRIBUTES = {
  createdAt: 'created_at',
  creationName: 'creation_name',
  discordServerId: 'discord_server_id',
  googleAnalyticsId: 'google_analytics_id',
  hasRss: 'has_rss',
  hasSentRssNotify: 'has_sent_rss_notify',
  imageSmallUrl: 'image_small_url',
  imageUrl: 'image_url',
  isChargedImmediately: 'is_charged_immediately',
  isMonthly: 'is_monthly',
  isNsfw: 'is_nsfw',
  mainVideoEmbed: 'main_video_embed',
  mainVideoUrl: 'main_video_url',
  oneLiner: 'one_liner',
  patronCount: 'patron_count',
  payPerName: 'pay_per_name',
  pledgeUrl: 'pledge_url',
  publishedAt: 'published_at',
  rssArtworkUrl: 'rss_artwork_url',
  rssFeedTitle: 'rss_feed_title',
  showEarnings: 'show_earnings',
  summary: 'summary',
  thanksEmbed: 'thanks_embed',
  thanksMsg: 'thanks_msg',
  thanksVideoUrl: 'thanks_video_url',
  url: 'url',
  vanity: 'vanity',
} as const;

export const PATREON_TIER_ATTRIBUTES = {
  amountCents: 'amount_cents',
  createdAt: 'created_at',
  description: 'description',
  discordRoleIds: 'discord_role_ids',
  editedAt: 'edited_at',
  imageUrl: 'image_url',
  patronCount: 'patron_count',
  postCount: 'post_count',
  published: 'published',
  publishedAt: 'published_at',
  remaining: 'remaining',
  requiresShipping: 'requires_shipping',
  title: 'title',
  unpublishedAt: 'unpublished_at',
  url: 'url',
  userLimit: 'user_limit',
} as const;

export const PATREON_MEMBER_ATTRIBUTES = {
  campaignLifetimeSupportCents: 'campaign_lifetime_support_cents',
  currentlyEntitledAmountCents: 'currently_entitled_amount_cents',
  email: 'email',
  fullName: 'full_name',
  isFollower: 'is_follower',
  lastChargeDate: 'last_charge_date',
  lastChargeStatus: 'last_charge_status',
  lifetimeSupportCents: 'lifetime_support_cents',
  nextChargeDate: 'next_charge_date',
  note: 'note',
  patronStatus: 'patron_status',
  pledgeCadence: 'pledge_cadence',
  pledgeRelationshipStart: 'pledge_relationship_start',
  willPayAmountCents: 'will_pay_amount_cents',
} as const;

export const PATREON_MEMBER_RELATIONSHIPS = {
  address: 'address',
  campaign: 'campaign',
  currentlyEntitledTiers: 'currently_entitled_tiers',
  pledgeHistory: 'pledge_history',
  user: 'user',
} as const;

export const PATREON_ADDRESS_ATTRIBUTES = {
  addressee: 'addressee',
  city: 'city',
  country: 'country',
  createdAt: 'created_at',
  line1: 'line_1',
  line2: 'line_2',
  phoneNumber: 'phone_number',
  postalCode: 'postal_code',
  state: 'state',
} as const;
export const PATREON_PLEDGE_ATTRIBUTES = {
  amountCents: 'amount_cents',
  currencyCode: 'currency_code',
  date: 'date',
  paymentStatus: 'payment_status',
  tierId: 'tier_id',
  tierTitle: 'tier_title',
  type: 'type',
} as const;

export const PATREON_PAYMENT_STATUS = {
  paid: 'Paid',
  declined: 'Declined',
  deleted: 'Deleted',
  pending: 'Pending',
  refunded: 'Refunded',
  fraud: 'Fraud',
  other: 'Other',
} as const;
export const PATREON_PATRON_STATUS = {
  activePatron: 'active_patron',
  declinedPatron: 'declined_patron',
  formerPatron: 'former_patron',
} as const;

export const PATREON_PLEDGE_TYPE = {
  pledgeStart: 'pledge_start',
  pledgeUpgrade: 'pledge_upgrade',
  pledgeDowngrade: 'pledge_downgrade',
  pledgeDelete: 'pledge_delete',
  subscription: 'subscription',
} as const;

export const PATREON_INCLUDE_TYPE = {
  campaign: 'campaign',
  creator: 'creator',
  goals: 'goals',
  rewards: 'rewards',
  user: 'user',
} as const;

export const PATREON_SOCIAL_CONNECTIONS_TYPE = {
  deviantart: 'deviantart',
  discord: 'discord',
  facebook: 'facebook',
  google: 'google',
  instagram: 'instagram',
  reddit: 'reddit',
  spotify: 'spotify',
  spotifyOpenAccess: 'spotify_open_access',
  twitch: 'twitch',
  twitter: 'twitter',
  vimeo: 'vimeo',
  youtube: 'youtube',
} as const;
