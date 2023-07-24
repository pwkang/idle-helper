import {ApplicationCommand, Client, DiscordAPIError, Routes, SlashCommandBuilder} from 'discord.js';
import {logger} from '@idle-helper/utils';
import {djsRestClient} from '@idle-helper/services';

export interface ICreateGlobalSlashCommand {
  client: Client;
  commands: ReturnType<SlashCommandBuilder['toJSON']>;
}

export const _createGlobalSlashCommand = async ({commands, client}: ICreateGlobalSlashCommand) => {
  try {
    const data = await djsRestClient.post(Routes.applicationCommands(client.user?.id!), {
      body: commands,
    });
    return data as ApplicationCommand;
  } catch (e: DiscordAPIError | any) {
    logger({
      message: e.rawError.message,
      variant: 'create-global-slash-command',
      logLevel: 'error',
      clusterId: client.cluster?.id,
    });
    return null;
  }
};
