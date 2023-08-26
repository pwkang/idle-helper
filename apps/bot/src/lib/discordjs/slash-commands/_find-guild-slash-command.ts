import {ApplicationCommand, Client, Guild, Routes} from 'discord.js';
import {djsRestClient} from '@idle-helper/services';
import {logger} from '@idle-helper/utils';

export interface IGetGuildSlashCommands {
  client: Client;
  guild: Guild;
  commandId: string;
}

export const _findGuildSlashCommand = async ({
  guild,
  client,
  commandId,
}: IGetGuildSlashCommands) => {
  if (!client.user) return [];

  try {
    const data = await djsRestClient.get(
      Routes.applicationGuildCommand(client.user.id, guild.id, commandId),
    );

    return data as ApplicationCommand;
  } catch (e: any) {
    logger({
      message: e.rawError?.message,
      variant: 'find-guild-slash-command',
      logLevel: 'error',
      clusterId: client.cluster?.id,
    });
    return null;
  }
};
