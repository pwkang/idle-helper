import type {Client} from 'discord.js';
import { PermissionsBitField} from 'discord.js';
import {djsMemberHelper} from '../../discordjs/member';
import {serverService} from '../../../services/database/server.service';

interface IIsServerAdmin {
  client: Client;
  serverId: string;
  userId: string;
}

const PERMISSIONS = [
  PermissionsBitField.Flags.ManageGuild,
  PermissionsBitField.Flags.Administrator
];

export const _isServerAdmin = async ({
  serverId,
  client,
  userId
}: IIsServerAdmin) => {
  const member = await djsMemberHelper.getMember({
    client,
    serverId,
    userId
  });
  if (!member) return false;
  const hasPermission = member.permissions.any(PERMISSIONS);
  if (hasPermission) return true;
  const serverAccount = await serverService.findServerById(serverId);
  if (!serverAccount) return false;
  const memberRoles = member.roles.cache.map((role) => role.id);
  return (
    serverAccount.settings.admin.rolesId.some((roleId) =>
      memberRoles.includes(roleId)
    ) || serverAccount.settings.admin.usersId.includes(userId)
  );
};
