import {Client} from 'discord.js';
import {djsServerHelper} from '../server';
import {_fetchMember} from './_fetch-member';
import {logger} from '@idle-helper/utils';

interface IAddRoles {
  client: Client;
  serverId: string;
  userId: string;
  roleIds: string[];
}

export const _removeRoles = async ({client, serverId, userId, roleIds}: IAddRoles) => {
  const server = await djsServerHelper.getServer({
    serverId,
    client,
  });
  if (!server) return;
  const member = await _fetchMember({
    userId,
    client,
    serverId,
  });
  if (!member) return;
  const roles = server.roles.cache.filter((role) => roleIds.includes(role.id));
  if (!roles.size) return;

  try {
    const newMember = await member.roles.remove(roles);
    await newMember.fetch(true);
  } catch (e) {
    logger({
      clusterId: client.cluster?.id,
      logLevel: 'error',
      message: `Failed to remove roles ${roleIds.join(', ')} to ${userId} in ${serverId}`,
      variant: 'add-roles',
    });
  }
};
