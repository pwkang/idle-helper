import {_fetchMember} from './_fetch-member';
import {_addRoles} from './_add-role';
import {_removeRoles} from './_remove-role';
import {_fetchAllMembers} from './_fetch-all-members';

export const djsMemberHelper = {
  getMember: _fetchMember,
  addRoles: _addRoles,
  removeRoles: _removeRoles,
  fetchAllMembers: _fetchAllMembers
};
