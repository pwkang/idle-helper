import patreonUrlGenerator from './patreon-url-generator';
import {IFetchPatreonCampaignMembersResponse, IFetchPatreonCampaignResponse} from '../type';
import {logger, sleep} from '@idle-helper/utils';
import {patreonAxiosClient} from '@idle-helper/services';
import {Client} from 'discord.js';

const PATREON_CAMPAIGN_ID = process.env.PATREON_CAMPAIGN_ID!;

export const getPatrons = async (
  client: Client
): Promise<Pick<Awaited<IFetchPatreonCampaignMembersResponse>, 'data' | 'included'>> => {
  const data: IFetchPatreonCampaignMembersResponse['data'] = [];
  const included: IFetchPatreonCampaignMembersResponse['included'] = [];
  let nextCursor: string | undefined = undefined;

  while (true) {
    try {
      const url = patreonUrlGenerator.generateFetchPatreonApiUrl({
        campaignId: PATREON_CAMPAIGN_ID,
        count: 200,
        include: {
          member: [
            'last_charge_date',
            'last_charge_status',
            'lifetime_support_cents',
            'currently_entitled_amount_cents',
            'patron_status',
            'pledge_relationship_start',
            'next_charge_date',
            'email',
          ],
          user: ['email', 'full_name', 'social_connections'],
        },
        nextCursor,
      });

      const response = await patreonAxiosClient.get(url);
      const {
        data: responseData,
        included: responseIncluded,
        meta,
      } = response.data as IFetchPatreonCampaignMembersResponse;

      data.push(...responseData);
      included.push(...responseIncluded);

      if (!meta.pagination.cursors.next) break;
      await sleep(2000);
      nextCursor = meta.pagination.cursors.next;
    } catch (e: any) {
      logger({
        logLevel: 'error',
        message: e,
        variant: 'PATREON_SERVICE',
        clusterId: client.cluster?.id,
      });
    }
  }

  return {
    data,
    included,
  };
};

const getCampaignInfo = async (client: Client) => {
  const url = patreonUrlGenerator.generateFetchCampaignUrl({
    include: {
      tiers: ['amount_cents', 'patron_count', 'discord_role_ids', 'title'],
      campaign: [
        'patron_count',
        'is_monthly',
        'is_charged_immediately',
        'discord_server_id',
        'creation_name',
      ],
      user: ['email', 'full_name', 'social_connections'],
    },
  });
  try {
    const response = await patreonAxiosClient.get(url);
    return response.data as IFetchPatreonCampaignResponse;
  } catch (e: any) {
    logger({
      logLevel: 'error',
      message: e,
      variant: 'PATREON_SERVICE',
      clusterId: client.cluster?.id,
    });
    return null;
  }
};

const patreonApi = {
  getPatrons,
  getCampaignInfo,
};

export default patreonApi;
