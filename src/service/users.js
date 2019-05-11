import UserRepository from '../repository/users';
import GroupRepository from '../repository/userGroups';
import UserPermissionRepository from '../repository/userPermissions';
import GroupPermissionRepository from '../repository/userGroupPermissions';
import RsaTokens from '../util/rsaTokens';
import {getDB} from "../broker/database";
import { getHash } from "../util/hash";

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

async function getUserByUsername(username) {
  const user = await UserRepository.getUserByUsername(username);

  const [
    permissions,
    groups
  ] = await Promise.all([
    UserPermissionRepository.getPermissionsForUser(user.id),
    GroupRepository.getGroupsForUser(user.id)
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
    .map(({ permission }) => permission);

    const currentUserGroups = groupMembers
    .filter(({ user_id }) => user_id === user.id)
    .map(({ group_id }) => group_id);

    const currentUserGroupPermissions = Array.from(new Set([
      ...groupPermissions
      .filter(({ group_id }) => currentUserGroups.includes(group_id))
      .map(({ permission }) => permission),
    ]));

    return {
      ...user,
      permissions: currentUserPermissions,
      groupPermissions: currentUserGroupPermissions,
      groups: currentUserGroups,
    };
  });
}

async function editUser(id, { username, email, byond_key, permissions = [], groups = [], password }) {
  return await db.transaction(async () => {
    const hashedPassword = password && (await getHash(password));

    const userEditFuture = UserRepository.editUser(id, {
      username,
      email,
      byond_key,
      ...(hashedPassword && { password: hashedPassword }),
    });

    const userCurrentPermissions = await UserPermissionRepository.getPermissionsForUser(id);

    const newUserPermissions = permissions.filter(permission => !userCurrentPermissions.includes(permission));
    const removedUserPermissions = userCurrentPermissions.filter(permission => !permissions.includes(permission));

    const permissionAddFutures = newUserPermissions.map(permission => UserPermissionRepository.addPermissionToUser(id, permission));
    const permissionRemoveFutures = removedUserPermissions.map(permission => UserPermissionRepository.removePermissionFromUser(id, permission));

    const userCurrentGroups = await GroupRepository.getGroupsForUser(id);
    const userCurrentGroupIds = userCurrentGroups.map(({ id }) => id);

    const newUserGroups = groups.filter(groupId => !userCurrentGroupIds.includes(groupId));
    const removedUserGroups = userCurrentGroupIds.filter(groupId => !groups.includes(groupId));

    const groupAddFutures = newUserGroups.map(groupId => GroupRepository.addUserToGroup(id, groupId));
    const groupRemoveFutures = removedUserGroups.map(groupId => GroupRepository.removeUserFromGroup(id, groupId));

    await Promise.all([
      userEditFuture,
      ...permissionAddFutures,
      ...permissionRemoveFutures,
      ...groupAddFutures,
      ...groupRemoveFutures
    ]);

    return await getUser(id);
  });
}

async function deleteUser(id) {
  return await UserRepository.deleteUser(id);
}

async function createUser({ username, email, byond_key, permissions = [], groups = [], password }) {
  return await db.transaction(async () => {
    const hashedPassword = password && (await getHash(password));

    const user = await UserRepository.createUser({
      username,
      email,
      byond_key,
      ...(hashedPassword && { password: hashedPassword }),
    });

    const permissionAddFutures = permissions.map(permission => UserPermissionRepository.addPermissionToUser(user.id, permission));
    const groupAddFutures = groups.map(groupId => GroupRepository.addUserToGroup(user.id, groupId));

    const results = Promise.all([
      ...permissionAddFutures,
      ...groupAddFutures,
    ]);

    await results;

    return await getUser(user.id);
  });
}

export default {
  getUser,
  getUsers,
  getUserByUsername,
  editUser,
  deleteUser,
  createUser,
}