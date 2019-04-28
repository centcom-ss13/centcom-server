import UserRepository from '../repository/users';
import GroupRepository from '../repository/userGroups';
import UserPermissionRepository from '../repository/userPermissions';
import PermissionRepository from '../repository/permissions';
import GroupPermissionRepository from '../repository/userGroupPermissions';
import {getDB} from "../broker/database";

const db = getDB();

async function getUser(id) {
  const [
    user,
    permissions,
    groups
  ] = await Promise.all([
    UserRepository.getUser(id),
    UserPermissionRepository.getPermissionsForUser(id),
    GroupRepository.getGroupsForUser(id)
  ]);

  return {
    ...user,
    permissions,
    groups,
  };
}

async function getUsers() {
  const [
    users,
    userPermissions,
    groupMembers,
    groupPermissions,
  ] = await Promise.all([
    UserRepository.getUsers(),
    UserPermissionRepository.getAllUserPermissions(),
    GroupRepository.getAllGroupMemberships(),
    GroupPermissionRepository.getAllGroupPermissions(),
  ]);

  return users.map(user => {
    const currentUserPermissions = userPermissions
    .filter(({ user_id }) => user_id === user.id)
    .map(({ permission_id }) => permission_id);

    const currentUserGroups = groupMembers
    .filter(({ user_id }) => user_id === user.id)
    .map(({ group_id }) => group_id);

    const currentUserGroupPermissions = Array.from(new Set([
      ...groupPermissions
      .filter(({ group_id }) => currentUserGroups.includes(group_id))
      .map(({ permission_id }) => permission_id),
    ]));

    return {
      ...user,
      permissions: currentUserPermissions,
      groupPermissions: currentUserGroupPermissions,
      groups: currentUserGroups,
    };
  });
}

async function editUser({ id, nickname, email, byond_key, permissions = [], groups = [] }) {
  return await db.transaction(async () => {
    const userEditFuture = UserRepository.editUser(id, nickname, email, byond_key);

    const userCurrentPermissions = await UserPermissionRepository.getPermissionsForUser(id);
    const userCurrentPermissionIds = userCurrentPermissions.map(({ id }) => id);

    const newUserPermissions = permissions.filter(permissionId => !userCurrentPermissionIds.includes(permissionId));
    const removedUserPermissions = userCurrentPermissionIds.filter(permissionId => !permissions.includes(permissionId));

    const permissionAddFutures = newUserPermissions.map(permissionId => UserPermissionRepository.addPermissionToUser(id, permissionId));
    const permissionRemoveFutures = removedUserPermissions.map(permissionId => UserPermissionRepository.removePermissionFromUser(id, permissionId));

    const userCurrentGroups = await GroupRepository.getGroupsForUser(id);
    const userCurrentGroupIds = userCurrentGroups.map(({ id }) => id);

    const newUserGroups = groups.filter(groupId => !userCurrentGroupIds.includes(groupId));
    const removedUserGroups = userCurrentGroupIds.filter(groupId => !groups.includes(groupId));

    const groupAddFutures = newUserGroups.map(groupId => GroupRepository.addUserToGroup(id, groupId));
    const groupRemoveFutures = removedUserGroups.map(groupId => GroupRepository.removeUserFromGroup(id, groupId));

    return Promise.all([
      userEditFuture,
      ...permissionAddFutures,
      ...permissionRemoveFutures,
      ...groupAddFutures,
      ...groupRemoveFutures
    ]);
  });
}

async function deleteUser(id) {
  return await UserRepository.deleteUser(id);
}

async function createUser({ nickname, email, byond_key, permissions = [], groups = [] }) {
  const user = await UserRepository.createUser(nickname, email, byond_key);

  const permissionAddFutures = permissions.map(permissionId => UserPermissionRepository.addPermissionToUser(user.id, permissionId));
  const groupAddFutures = groups.map(groupId => GroupRepository.addUserToGroup(user.id, groupId));

  const results = Promise.all([
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