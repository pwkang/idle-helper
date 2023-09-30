import {
  ActionRow,
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonComponent,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  Client,
  Collection,
  InteractionUpdateOptions,
  MentionableSelectMenuBuilder,
  MentionableSelectMenuComponent,
  MessageActionRowComponent,
  MessageActionRowComponentBuilder,
  MessageCreateOptions,
  MessagePayload,
  RoleSelectMenuBuilder,
  RoleSelectMenuComponent,
  StringSelectMenuBuilder,
  StringSelectMenuComponent,
  StringSelectMenuInteraction,
  UserSelectMenuBuilder,
  UserSelectMenuComponent,
} from 'discord.js';
import ms from 'ms';
import {djsMessageHelper} from './index';
import djsInteractionHelper from '../interaction';

type TEventCB = (
  collected: BaseInteraction | StringSelectMenuInteraction,
  customId: string,
) => Promise<InteractionUpdateOptions | null> | InteractionUpdateOptions | null;

export interface SendInteractiveMessageProps {
  client: Client;
  channelId: string;
  options: string | MessagePayload | MessageCreateOptions;
  onEnd?: () => void;
}

export default async function _sendInteractiveMessage<EventType extends string>(
  {
    channelId,
    options,
    client,
    onEnd,
  }: SendInteractiveMessageProps) {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;

  const sentMessage = await djsMessageHelper.send({
    channelId,
    client,
    options,
  });
  if (!sentMessage) return;

  let allEventsFn: TEventCB | null = null;
  const registeredEvents = new Collection<string | EventType, TEventCB>();
  let collector = sentMessage.createMessageComponentCollector({
    idle: ms('1m'),
  });

  function every(callback: TEventCB) {
    allEventsFn = callback;
  }

  function on(customId: EventType extends undefined ? string : EventType, callback: TEventCB) {
    registeredEvents.set(customId, callback);
  }

  collector.on('collect', async (collected) => {
    if (collected.message.id !== sentMessage.id) return;
    const callback = registeredEvents.get(collected.customId as string);
    let replyOptions: InteractionUpdateOptions | null = null;

    if (allEventsFn) {
      replyOptions = await allEventsFn(collected, collected.customId);
    } else if (callback) {
      replyOptions = await callback(collected, collected.customId);
    }
    if (!replyOptions) return;
    await djsInteractionHelper.updateInteraction({
      interaction: collected,
      options: replyOptions,
      client,
    });
  });

  function stop() {
    collector.stop();
    collector.removeAllListeners();
    collector = undefined as any;
  }

  function isEnded() {
    return collector.ended;
  }

  collector.on('end', (collected, reason) => {
    if (!sentMessage) return;

    if (reason === 'idle') {
      onEnd?.();
      stop();
      djsMessageHelper.edit({
        client,
        message: sentMessage,
        options: {
          components: disableAllComponents(sentMessage.components),
        },
      });
    }
  });


  return {
    on,
    stop,
    isEnded,
    every,
    message: sentMessage,
  };
}

function disableAllComponents(components: ActionRow<MessageActionRowComponent>[]) {
  const row: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
  for (const component of components) {
    const _components = component.components.map((component) => {
      if (component instanceof ButtonComponent) {
        return ButtonBuilder.from(component).setDisabled(component.style !== ButtonStyle.Link);
      } else if (component instanceof StringSelectMenuComponent) {
        return StringSelectMenuBuilder.from(component).setDisabled(true);
      } else if (component instanceof UserSelectMenuComponent) {
        return UserSelectMenuBuilder.from(component).setDisabled(true);
      } else if (component instanceof RoleSelectMenuComponent) {
        return RoleSelectMenuBuilder.from(component).setDisabled(true);
      } else if (component instanceof MentionableSelectMenuComponent) {
        return MentionableSelectMenuBuilder.from(component).setDisabled(true);
      } else {
        return ChannelSelectMenuBuilder.from(component).setDisabled(true);
      }
    });
    row.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(_components));
  }

  return row;
}


// function disableAllComponents(components: ActionRow<MessageActionRowComponent>[]) {
//   // return JSON.parse(JSON.stringify(components));
//   return components.map((row) => {
//     if (row instanceof ActionRow<ButtonComponent>) {
//       const _components = row.components.map((component) => {
//         const _component = component as ButtonComponent;
//         return ButtonBuilder.from(_component).setDisabled(true);
//       });
//       return new ActionRowBuilder<ButtonBuilder>().addComponents(_components);
//     }
//     if (row instanceof ActionRow<StringSelectMenuComponent>) {
//       const _components = row.components.map((component) => {
//         const _component = component as StringSelectMenuComponent;
//         return StringSelectMenuBuilder.from(_component).setDisabled(true);
//       });
//       return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(_components);
//     }
//     // UserSelectMenuComponent
//     // RoleSelectMenuComponent
//     // MentionableSelectMenuComponent
//     // ChannelSelectMenuComponent
//
//     // const _row = row.components.map((component) => {
//     //   if (component instanceof ButtonComponent) {
//     //     return ButtonBuilder.from(component).setDisabled(true).toJSON();
//     //   } else if (component instanceof StringSelectMenuComponent) {
//     //     return StringSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   } else if (component instanceof UserSelectMenuComponent) {
//     //     return UserSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   } else if (component instanceof RoleSelectMenuComponent) {
//     //     return RoleSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   } else if (component instanceof MentionableSelectMenuComponent) {
//     //     return MentionableSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   } else {
//     //     return ChannelSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   }
//     // });
//     // return ActionRowBuilder.from(_row).toJSON();
//   });
// }
