import {_isServerAdmin} from './is-server-admin';
import {_isGuildLeader} from './is-guild-leader';
import {_isGuildMember} from './is-guild-member';

export const userChecker = {
  isServerAdmin: _isServerAdmin,
  isGuildLeader: _isGuildLeader,
  isGuildMember: _isGuildMember,
};
