import {Client} from 'discord.js';
import {logger} from '@idle-helper/utils';

interface IGetChannel {
  client: Client;
  serverId: string;
  channelId: string;
}

const _getChannel = async ({channelId, client}: IGetChannel) => {
  let channel = client.channels.cache.get(channelId);
  if (!channel) {
    try {
      channel = (await client.channels.fetch(channelId)) ?? undefined;
    } catch (err: any) {
      logger({
        clusterId: client.cluster?.id,
        logLevel: 'warn',
        message: err.message,
      });
    }
  }
  return channel;
};

export default _getChannel;
