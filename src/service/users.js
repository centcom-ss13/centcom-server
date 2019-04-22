import UserRepository from '../repository/users';
import GroupRepository from '../repository/userGroups';
import PermissionRepository from '../repository/userPermissions';

async function getUser(id) {
  return await UserRepository.getUser(id);
}

async function getUsers() {
  return await UserRepository.getUsers();
}

async function editUser({ id, nickname, email, byond_key, permissions = [], groups = [] }) {
  const userEditFuture = UserRepository.editUser(id, nickname, email, byond_key);

  const userCurrentPermissions = await PermissionRepository.getPermissionsForUser(id);
  const userCurrentPermissionIds = userCurrentPermissions.map(({ id }) => id);

  const newUserPermissions = permissions.filter(permissionId => !userCurrentPermissionIds.includes(permissionId));
  const removedUserPermissions = userCurrentPermissionIds.filter(permissionId => !permissions.includes(permissionId));

  const permissionAddFutures = newUserPermissions.map(permissionId => PermissionRepository.addPermissionToUser(id, permissionId));
  const permissionRemoveFutures = removedUserPermissions.map(permissionId => PermissionRepository.removePermissionFromUser(id, permissionId));

  const userCurrentGroups = await GroupRepository.getGroupsForUser(id);
  const userCurrentGroupIds = userCurrentGroups.map(({ id }) => id);

  const newUserGroups = groups.filter(groupId => !userCurrentGroupIds.includes(groupId));
  const removedUserGroups = userCurrentGroupIds.filter(groupId => !groups.includes(groupId));

  const groupAddFutures = newUserGroups.map(groupId => GroupRepository.addUserToGroup(id, groupId));
  const groupRemoveFutures = removedUserGroups.map(groupId => GroupRepository.removeUserFromGroup(id, groupId));

  const results = Promise.all([
    userEditFuture,
    ...permissionAddFutures,
    ...permissionRemoveFutures,
    ...groupAddFutures,
    ...groupRemoveFutures
  ]);

  return await results;
}

async function deleteUser(id) {
  return await UserRepository.deleteUser(id);
}

async function createUser({ nickname, email, byond_key, permissions = [], groups = [] }) {
  const userCreateFuture = UserRepository.createUser(nickname, email, byond_key);
  await userCreateFuture;

  const permissionAddFutures = permissions.map(permissionId => PermissionRepository.addPermissionToUser(id, permissionId));
  const groupAddFutures = groups.map(groupId => GroupRepository.addUserToGroup(id, groupId));

  const results = Promise.all([
    userCreateFuture,
    ...permissionAddFutures,
    ...groupAddFutures,
  ]);

  return await results;
}

export default {
  getUser,
  getUsers,
  editUser,
  deleteUser,
  createUser,
}