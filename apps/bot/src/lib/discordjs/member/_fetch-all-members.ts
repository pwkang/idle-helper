import type {Client, GuildMember, Snowflake} from 'discord.js';
import {Collection} from 'discord.js';
import {djsServerHelper} from '../server';

interface IFetchAllMembers {
  client: Client;
  serverId: string;
}

export const _fetchAllMembers = async ({
  serverId,
  client
}: IFetchAllMembers): Promise<Collection<Snowflake, GuildMember>> => {
  const server = await djsServerHelper.getServer({serverId, client});
  if (!server) return new Collection();

  if (!client.fetchedMemberGuilds.has(serverId)) {
    await server.members.fetch({
      time: 60000
    });
    client.fetchedMemberGuilds.set(serverId, true);
  }

  return server.members.cache;
};
