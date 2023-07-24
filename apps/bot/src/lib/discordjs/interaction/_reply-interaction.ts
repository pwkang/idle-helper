import {
  BaseInteraction,
  Client,
  Collection,
  DiscordAPIError,
  InteractionReplyOptions,
  InteractionResponse,
  InteractionUpdateOptions,
  StringSelectMenuInteraction,
} from 'discord.js';
import ms from 'ms';
import {logger} from '@idle-helper/utils';
import _updateInteraction from './_update-interaction';

export interface IReplyInteraction {
  client: Client;
  interaction: BaseInteraction;
  options: InteractionReplyOptions;
  interactive?: boolean;
}

export default async function _replyInteraction<T>({
  interaction,
  interactive,
  options,
  client,
}: IReplyInteraction) {
  if (!interaction.isRepliable() || interaction.replied) return;
  let interactionResponse: InteractionResponse | undefined;

  try {
    interactionResponse = await interaction.reply(options);
  } catch (error: DiscordAPIError | any) {
    logger({
      message: error.rawError,
      variant: 'replyInteraction',
      logLevel: 'warn',
      clusterId: client.cluster?.id,
    });
  }
  if (!interactive || !interactionResponse) return;
  const sentMessage = await interactionResponse.fetch();
  const channel = interaction.channel;
  const registeredEvents = new Collection<string | T, Function>();
  let allEventsFn: Function | null = null;
  if (!channel) return;
  const collector = interactionResponse.createMessageComponentCollector({
    idle: ms('1m'),
  });

  function on(
    customId: T extends undefined ? string : T,
    callback: (
      collected: BaseInteraction | StringSelectMenuInteraction
    ) => Promise<InteractionUpdateOptions | null> | InteractionUpdateOptions | null
  ) {
    registeredEvents.set(customId, callback);
  }

  function every(
    callback: (
      collected: BaseInteraction | StringSelectMenuInteraction,
      customId: string
    ) => Promise<InteractionUpdateOptions | null> | InteractionUpdateOptions | null
  ) {
    allEventsFn = callback;
  }

  collector?.on('collect', async (collected) => {
    if (collected.message.id !== sentMessage.id) return;
    const callback = registeredEvents.get(collected.customId as string);
    let replyOptions: InteractionUpdateOptions | null = null;
    if (allEventsFn) {
      replyOptions = await allEventsFn(collected, collected.customId as string);
    } else if (callback) {
      replyOptions = await callback(collected);
    }
    if (!replyOptions) return;
    await _updateInteraction({
      client,
      interaction: collected,
      options: replyOptions,
    });
  });

  function stop() {
    collector?.stop();
    collector?.removeAllListeners();
  }

  collector?.on('end', async (collected, reason) => {
    if (reason === 'idle') {
      try {
        await interactionResponse?.edit({
          components: [],
        });
      } catch (error: DiscordAPIError | any) {
        logger({
          message: error.message,
          logLevel: 'warn',
          variant: 'replyInteraction',
          clusterId: client.cluster?.id,
        });
      }
    }
  });

  return {
    on,
    stop,
    every,
  };
}
