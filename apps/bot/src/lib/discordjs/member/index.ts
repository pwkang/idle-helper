import {_fetchMember} from './_fetch-member';
import {_addRoles} from './_add-role';
import {_removeRoles} from './_remove-role';

export const djsMemberHelper = {
  getMember: _fetchMember,
  addRoles: _addRoles,
  removeRoles: _removeRoles
};
