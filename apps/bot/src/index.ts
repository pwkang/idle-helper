import {ClusterManager} from 'discord-hybrid-sharding';
import * as dotenv from 'dotenv';
import {logger} from '@idle-helper/utils';

dotenv.config();

const totalShards = process.env.TOTAL_SHARDS ? Number(process.env.TOTAL_SHARDS) : 'auto';
const totalClusters = process.env.TOTAL_CLUSTERS ? Number(process.env.TOTAL_CLUSTERS) : 'auto';

const manager = new ClusterManager(`${__dirname}/bot.js`, {
  token: process.env.BOT_TOKEN,
  totalShards,
  totalClusters,
});

manager.on('clusterCreate', (cluster) => {
  logger({
    message: `Launched Cluster ${cluster.id}`,
  });
});
manager.spawn({timeout: -1}).catch((error) => {
  logger({
    message: error.message,
  });
});
