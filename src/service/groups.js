import GroupRepository from '../repository/userGroups';
import GroupPermissionRepository from '../repository/userGroupPermissions';
import UserPermissionRepository from "../repository/userPermissions";
import UserRepository from "../repository/users";

async function getGroup(id) {
  const [
    group,
    permissions,
  ] = await Promise.all([
    GroupRepository.getGroup(id),
    GroupPermissionRepository.getPermissionsForGroup(id),
  ]);

  return {
    ...group,
    permissions,
  };
}

async function getGroups() {
  const [
    groups,
    groupPermissions,
  ] = await Promise.all([
    GroupRepository.getGroups(),
    GroupPermissionRepository.getAllGroupPermissions(),
  ]);

  return groups.map(group => {
    const currentGroupPermissions = groupPermissions
    .filter(({ group_id }) => group_id === group.id)
    .map(({ permission_id }) => permission_id);

    return {
      ...group,
      permissions: currentGroupPermissions,
    };
  });
}

async function getGroupsForUser(user_id) {
  return await GroupRepository.getGroupsForUser(user_id);
}

async function editGroup({ id, name, description, permissions = [] }) {
  const groupEditFuture = GroupRepository.editGroup(id, name, description);

  const groupCurrentPermissions = await GroupPermissionRepository.getPermissionsForGroup(id);
  const groupCurrentPermissionIds = groupCurrentPermissions.map(({ id }) => id);

  const newGroupPermissions = permissions.filter(permissionId => !groupCurrentPermissionIds.includes(permissionId));
  const removedGroupPermissions = groupCurrentPermissionIds.filter(permissionId => !permissions.includes(permissionId));

  const permissionAddFutures = newGroupPermissions.map(permissionId => GroupPermissionRepository.addPermissionToGroup(id, permissionId));
  const permissionRemoveFutures = removedGroupPermissions.map(permissionId => GroupPermissionRepository.removePermissionFromGroup(id, permissionId));

  const results = Promise.all([
    groupEditFuture,
    ...permissionAddFutures,
    ...permissionRemoveFutures,
  ]);

  return await results;
}

async function deleteGroup(id) {
  return await GroupRepository.deleteGroup(id);
}

async function createGroup({ name, description, permissions = [] }) {
  const group = await GroupRepository.createGroup(name, description);

  const permissionAddFutures = permissions.map(permissionId => GroupPermissionRepository.addPermissionToGroup(group.id, permissionId));

  const results = Promise.all([
    ...permissionAddFutures,
  ]);

  return await results;
}

export default {
  getGroup,
  getGroups,
  editGroup,
  deleteGroup,
  createGroup,
  getGroupsForUser,
}