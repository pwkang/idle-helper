import {
  Client,
  DiscordAPIError,
  InteractionUpdateOptions,
  MessageComponentInteraction,
} from 'discord.js';
import {logger} from '@idle-helper/utils';

export interface IUpdateInteraction {
  client: Client;
  interaction: MessageComponentInteraction;
  options: InteractionUpdateOptions;
}

export default async function _updateInteraction({
  interaction,
  options,
  client,
}: IUpdateInteraction) {
  try {
    await interaction.update(options);
  } catch (error: DiscordAPIError | any) {
    logger({
      message: error.rawError,
      variant: 'updateInteraction',
      logLevel: 'warn',
      clusterId: client.cluster?.id,
    });
  }
}
