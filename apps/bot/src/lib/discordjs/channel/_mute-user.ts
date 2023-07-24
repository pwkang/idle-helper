import {Client, PermissionsBitField, TextChannel} from 'discord.js';
import {djsMessageHelper} from '../message';
import _unMuteUser from './_unmute-ser';

const requiredPermissions = [PermissionsBitField.Flags.ManageRoles];

export interface IMuteUser {
  userId: string;
  channelId: string;
  client: Client;
  unMuteIn?: number;
}

const _muteUser = async ({userId, client, channelId, unMuteIn}: IMuteUser) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;
  if (!(channel instanceof TextChannel)) return;

  if (!channel.permissionsFor(client.user?.id ?? '')?.has(requiredPermissions)) {
    await djsMessageHelper.send({
      channelId,
      client,
      options: {
        content:
          'I do not have permission to mute this user. Please make sure I have the `Manage Roles` permission.',
      },
    });
    return;
  }

  await channel.permissionOverwrites.edit(userId, {
    SendMessages: false,
  });

  if (unMuteIn) {
    setTimeout(async () => {
      await _unMuteUser({
        client,
        channelId,
        userId,
        removeUser: !channel.permissionOverwrites.cache.has(userId),
      });
    }, unMuteIn);
  }
};

export default _muteUser;
