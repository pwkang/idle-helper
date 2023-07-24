import {Client} from 'discord.js';
import {serverService} from '../../services/database/server.service';

const loadServerOnReady = async (client: Client) => {
  await registerNewServers(client);
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
      name: server.name,
    });
  });
};

export default loadServerOnReady;
