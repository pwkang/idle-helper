import {_getUser} from './get-user';
import {logger} from '@idle-helper/utils';
import type {BaseMessageOptions} from 'discord.js';

interface IDmUser {
  userId: string;
  client: any;
  options: BaseMessageOptions;
}

export const _dmUser = async ({userId, client, options}: IDmUser) => {
  const user = await _getUser({
    client,
    userId
  });
  if (!user) return;
  try {
    await user.send(options);
  } catch (e) {
    logger({
      logLevel: 'warn',
      message: `Failed to send DM to ${userId}`,
      clusterId: client.cluster?.id
    });
  }
};
