import PermissionRepository from '../repository/permissions';
import UserPermissionRepository from '../repository/userPermissions';
import GroupRepository from '../repository/userGroups';
import GroupPermissionRepository from '../repository/userGroupPermissions';

async function getDerivedUserPermissions(user_id) {
  const userGroups = await GroupRepository.getGroupsForUser(user_id);
  const [
    userPermissions,
    groupPermissions,
    permissions,
  ] = await Promise.all([
    UserPermissionRepository.getPermissionsForUser(user_id),
    Promise.all(userGroups.map(({ id }) => GroupPermissionRepository.getPermissionsForGroup(id))),
    PermissionRepository.getPermissions(),
  ]);

  const aggregatedPermissionIds = Array.from(new Set([
    ...userPermissions.map(({ id }) => id),
    ...groupPermissions.reduce((acc, cur) => [...acc, ...cur.map(({ id }) => id)], []),
  ]));

  const filledPermissions = aggregatedPermissionIds.map(id => permissions.find(permission => permission.id === id));

  return filledPermissions;
}

async function getPermissions() {
  return await PermissionRepository.getPermissions();
}

async function createPermission(input) {
  return await PermissionRepository.createPermission(input);
}

async function editPermission(id, input) {
  return await PermissionRepository.editPermission(id, input);
}

async function deletePermission(id) {
  return await PermissionRepository.deletePermission(id);
}

export default {
  getDerivedUserPermissions,
  getPermissions,
  createPermission,
  editPermission,
  deletePermission,
};