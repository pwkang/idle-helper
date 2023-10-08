import type {Client} from 'discord.js';
import {logger} from '@idle-helper/utils';

interface IGetServer {
  client: Client;
  serverId: string;
}

export const _getServer = async ({serverId, client}: IGetServer) => {
  let server = client.guilds.cache.get(serverId);
  if (!server) {
    try {
      server = await client.guilds.fetch(serverId);
    } catch (e) {
      logger({
        logLevel: 'error',
        message: `Failed to fetch server ${serverId}`,
        clusterId: client.cluster?.id,
        variant: 'fetch-server'
      });
    }
  }
  return server;
};
