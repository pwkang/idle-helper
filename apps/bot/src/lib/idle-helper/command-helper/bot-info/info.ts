import type {Client, Guild} from 'discord.js';
import { EmbedBuilder} from 'discord.js';
import {
  BOT_COLOR,
  BOT_INVITE_LINK,
  SUPPORT_SERVER_INVITE_LINK
} from '@idle-helper/constants';
import {userService} from '../../../../services/database/user.service';
import convertMsToHumanReadableString from '../../../../utils/convert-ms-to-human-readable-string';

interface IInfo {
  client: Client;
  server: Guild;
}

export const _info = async ({client, server}: IInfo): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);

  const uptime = getUptime(client);
  const totalGuilds = await getTotalGuilds(client);
  const totalUsers = await userService.calcTotalUsers();
  const {clusterId, totalCluster} = getClusterInfo(client);
  const {shardId, totalShard} = getShardInfo(client, server);

  embed.addFields(
    {
      name: '**Uptime**',
      value: uptime,
      inline: true
    },
    {
      name: '**Servers**',
      value: totalGuilds.toLocaleString(),
      inline: true
    },
    {
      name: '**Users**',
      value: totalUsers.toLocaleString(),
      inline: true
    },
    {
      name: '**Shard**',
      value: `${shardId + 1}/${totalShard}`,
      inline: true
    },
    {
      name: '**Cluster**',
      value: `${clusterId + 1}/${totalCluster}`,
      inline: true
    },
    {
      name: '**Links**',
      value: `**[Invite Link](${BOT_INVITE_LINK}) | [Support Server](${SUPPORT_SERVER_INVITE_LINK})**`
    }
  );

  return embed;
};

const getTotalGuilds = async (client: Client): Promise<number> => {
  if (client.cluster) {
    return new Promise((resolve) => {
      client.cluster
        ?.broadcastEval((client) => client.guilds.cache.size)
        .then((result) => {
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
      totalCluster
    };
  } else {
    return {
      clusterId: 0,
      totalCluster: 1
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
      totalShard
    };
  } else {
    return {
      shardId: 0,
      totalShard: 1
    };
  }
};

const getUptime = (client: Client): string => {
  const uptime = client.uptime ?? 0;

  const str = convertMsToHumanReadableString(uptime);

  return str.trim();
};
