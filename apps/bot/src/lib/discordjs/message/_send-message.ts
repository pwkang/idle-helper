import type {Channel, Client, Message, MessageCreateOptions, MessagePayload} from 'discord.js';
import {PermissionsBitField, TextChannel, ThreadChannel} from 'discord.js';
import {logger} from '@idle-helper/utils';

const requiredPermissions = [PermissionsBitField.Flags.SendMessages];

export interface SendMessageProps {
  client: Client;
  channelId: string;
  options: string | MessagePayload | MessageCreateOptions;
}

export default async function _sendMessage({
  channelId,
  options,
  client,
}: SendMessageProps): Promise<Message | undefined> {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;

  return checkTypeAndSend({channel, options, client});
}

interface CheckTypeAndSendProps {
  channel: Channel;
  options: string | MessagePayload | MessageCreateOptions;
  client: Client;
}

async function checkTypeAndSend({
  channel,
  options,
  client,
}: CheckTypeAndSendProps): Promise<Message | undefined> {
  let sentMessage;
  if (channel instanceof TextChannel) {
    const textChannel = channel as TextChannel;
    if (!textChannel.permissionsFor(client.user!)?.has(requiredPermissions)) return;
    try {
      sentMessage = await textChannel.send(options);
    } catch (error: any) {
      logger({
        message: error.message,
        logLevel: 'warn',
        variant: 'sendMessage',
        clusterId: client.cluster?.id,
      });
      return;
    }
  }
  if (channel instanceof ThreadChannel) {
    const threadChannel = channel as ThreadChannel;
    if (!threadChannel.permissionsFor(client.user!)?.has(requiredPermissions)) return;
    try {
      sentMessage = await threadChannel.send(options);
    } catch (error: any) {
      logger({
        message: error.message,
        logLevel: 'warn',
        variant: 'sendMessage',
        clusterId: client.cluster?.id,
      });
      return;
    }
  }
  return sentMessage;
}