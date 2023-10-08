import type {Client} from 'discord.js';
import {serverService} from '../../services/database/server.service';
import {infoService} from '../../services/database/info.service';
import {redisServerInfo} from '../../services/redis/server-info.redis';
import {IDLE_FARM_SERVER_INFO} from '@idle-helper/constants';

const loadServerOnReady = async (client: Client) => {
  await registerNewServers(client);
  await infoService.init();
};

const registerNewServers = async (client: Client) => {
  const cachedServers = client.guilds.cache;
  const registeredServersId = await serverService.listRegisteredServersId();

  const serversToRegister = cachedServers.filter(
    (server) => !registeredServersId.includes(server.id)
  );
  serversToRegister.forEach((server) => {
    serverService.registerServer({
      serverId: server.id,
      name: server.name
    });
  });

  cachedServers.forEach((server) => {
    redisServerInfo.setServerName({
      serverId: server.id,
      name: server.name
    });
  });
  await redisServerInfo.setServerName({
    serverId: IDLE_FARM_SERVER_INFO.id,
    name: IDLE_FARM_SERVER_INFO.name
  });
};

export default loadServerOnReady;
