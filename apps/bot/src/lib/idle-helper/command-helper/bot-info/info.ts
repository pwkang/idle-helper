import {Client, EmbedBuilder, Guild} from 'discord.js';
import {BOT_COLOR, BOT_INVITE_LINK, SUPPORT_SERVER_INVITE_LINK} from '@idle-helper/constants';

interface IInfo {
  client: Client;
  server: Guild;
}

export const _info = async ({client, server}: IInfo): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed);

  const uptime = getUptime(client);
  const totalGuilds = await getTotalGuilds(client);
  const {clusterId, totalCluster} = getClusterInfo(client);
  const {shardId, totalShard} = getShardInfo(client, server);

  embed.addFields({
    name: '**Uptime**',
    value: uptime,
    inline: true,
  }, {
    name: '**Servers**',
    value: totalGuilds.toLocaleString(),
    inline: true,
  }, {
    name: '**Shard**',
    value: `${shardId + 1}/${totalShard}`,
    inline: true,
  }, {
    name: '**Cluster**',
    value: `${clusterId + 1}/${totalCluster}`,
    inline: true,
  });

  embed.addFields({
    name: '**Lnks**',
    value: `**[Invite Link](${BOT_INVITE_LINK}) | [Support Server](${SUPPORT_SERVER_INVITE_LINK})**`,
  });

  return embed;
};

const getTotalGuilds = async (client: Client): Promise<number> => {
  if (client.cluster) {
    return new Promise((resolve, reject) => {
      client.cluster?.broadcastEval(client => client.guilds.cache.size).then(result => {
        const total = result.reduce((acc, guildCount) => acc + guildCount, 0);
        resolve(total);
      });
    });
  } else {
    return client.guilds.cache.size;
  }
};

interface IClusterInfoResult {
  clusterId: number;
  totalCluster: number;
}

const getClusterInfo = (client: Client): IClusterInfoResult => {
  if (client.cluster) {
    const totalCluster = client.cluster?.count;
    const clusterId = client.cluster?.id;
    return {
      clusterId,
      totalCluster,
    };
  } else {
    return {
      clusterId: 0,
      totalCluster: 1,
    };
  }
};

interface IShardInfoResult {
  shardId: number;
  totalShard: number;
}

const getShardInfo = (client: Client, server: Guild): IShardInfoResult => {
  if (client.shard) {
    const totalShard = client.cluster?.info.TOTAL_SHARDS ?? 1;
    const shardId = server.shard.id;
    return {
      shardId,
      totalShard,
    };
  } else {
    return {
      shardId: 0,
      totalShard: 1,
    };
  }
};

const getUptime = (client: Client): string => {
  const uptime = client.uptime ?? 0;
  const days = Math.floor(uptime / 86400000);
  const hours = Math.floor(uptime / 3600000) % 24;
  const minutes = Math.floor(uptime / 60000) % 60;
  const seconds = Math.floor(uptime / 1000) % 60;

  let str = '';
  if (days > 0) str += `${days}d `;
  if (hours > 0) str += `${hours}h `;
  if (minutes > 0) str += `${minutes}m `;
  if (seconds > 0) str += `${seconds}s `;

  return str.trim();
};