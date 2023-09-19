import {
  BaseInteraction,
  Client,
  Collection,
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

type TEventCB = (
  collected: BaseInteraction | StringSelectMenuInteraction,
  customId: string,
) => Promise<InteractionUpdateOptions | null> | InteractionUpdateOptions | null;

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
  } catch (error: any) {
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
  const registeredEvents = new Collection<string | T, TEventCB>();
  let allEventsFn: TEventCB | null = null;
  if (!channel) return;
  let collector = interactionResponse.createMessageComponentCollector({
    idle: ms('1m'),
  });

  function on(customId: T extends undefined ? string : T, callback: TEventCB) {
    registeredEvents.set(customId, callback);
  }

  function every(callback: TEventCB) {
    allEventsFn = callback;
  }

  collector?.on('collect', async (collected) => {
    if (collected.message.id !== sentMessage.id) return;
    const callback = registeredEvents.get(collected.customId as string);
    let replyOptions: InteractionUpdateOptions | null = null;
    if (allEventsFn) {
      replyOptions = await allEventsFn(collected, collected.customId);
    } else if (callback) {
      replyOptions = await callback(collected, collected.customId);
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
    collector = null as any;
  }

  collector?.on('end', async (collected, reason) => {
    if (reason === 'idle') {
      try {
        await interactionResponse?.edit({
          components: [],
        });
      } catch (error: any) {
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
