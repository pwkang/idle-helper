import {Events} from 'discord.js';
import loadServerOnReady from '../../handler/on-ready/server-startup.handler';
import {logger} from '@idle-helper/utils';

export default <BotEvent>{
  eventName: Events.ClientReady,
  once: true,
  execute: async (client) => {
    logger({
      message: `Logged in as ${client.user?.tag}!`,
      clusterId: client.cluster?.id,
    });

    loadServerOnReady(client);
  },
};
