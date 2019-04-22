import GroupRepository from '../repository/userGroups';
import GroupPermissionRepository from '../repository/userGroupPermissions';

async function getGroup(id) {
  return await GroupRepository.getGroup(id);
}

async function getGroups() {
  return await GroupRepository.getGroups();
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
  const groupEditFuture = GroupRepository.createGroup(name, description);
  await groupEditFuture;

  const permissionAddFutures = permissions.map(permissionId => GroupPermissionRepository.addPermissionToGroup(id, permissionId));

  const results = Promise.all([
    groupEditFuture,
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