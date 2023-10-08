import type {GuildMember} from 'discord.js';
import type {IGuild} from '@idle-helper/models';

interface IIsGuildMember {
  guild: IGuild;
  member: GuildMember;
}

export const _isGuildMember = ({member, guild}: IIsGuildMember) => {
  return member.roles.cache.some((role) => guild.roleId === role.id);
};
