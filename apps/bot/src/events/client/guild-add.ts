import {Events, Guild} from 'discord.js';
import {serverService} from '../../services/database/server.service';

export default <BotEvent>{
  eventName: Events.GuildCreate,
  once: false,
  execute: async (client, guild: Guild) => {
    const serverInfo = await serverService.findServerById(guild.id);
    if (!serverInfo) {
      serverService.registerServer({
        serverId: guild.id,
        name: guild.name,
      });
    }
  },
};
