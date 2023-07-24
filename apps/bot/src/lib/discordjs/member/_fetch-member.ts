import {Client} from 'discord.js';
import {djsServerHelper} from '../server';
import {logger} from '@idle-helper/utils';

interface IFetchMember {
  client: Client;
  serverId: string;
  userId: string;
}

export const _fetchMember = async ({serverId, userId, client}: IFetchMember) => {
  const server = await djsServerHelper.getServer({serverId, client});
  if (!server) return;
  let member = server.members.cache.get(userId);
  if (!member) {
    try {
      member = await server.members.fetch(userId);
    } catch (e) {
      logger({
        clusterId: client.cluster?.id,
        logLevel: 'error',
        message: `Failed to fetch member ${userId} in ${serverId}`,
        variant: 'fetch-member',
      });
    }
  }
  return member;
};
