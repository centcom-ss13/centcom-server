import GroupRepository from '../repository/userGroups';
import GroupPermissionRepository from '../repository/userGroupPermissions';
import {getDB} from "../broker/database";

const db = getDB();

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
    .map(({ permission }) => permission);

    return {
      ...group,
      permissions: currentGroupPermissions,
    };
  });
}

async function getGroupsForUser(user_id) {
  return await GroupRepository.getGroupsForUser(user_id);
}

async function editGroup(id, { name, description, permissions = [] }) {
  return await db.transaction(async () => {
    const groupEditFuture = GroupRepository.editGroup(id, { name, description });

    const groupCurrentPermissions = await GroupPermissionRepository.getPermissionsForGroup(id);

    const newGroupPermissions = permissions.filter(permission => !groupCurrentPermissions.includes(permission));
    const removedGroupPermissions = groupCurrentPermissions.filter(permission => !permissions.includes(permission));

    const permissionAddFutures = newGroupPermissions.map(permission => GroupPermissionRepository.addPermissionToGroup(id, permission));
    const permissionRemoveFutures = removedGroupPermissions.map(permission => GroupPermissionRepository.removePermissionFromGroup(id, permission));

    const results = Promise.all([
      groupEditFuture,
      ...permissionAddFutures,
      ...permissionRemoveFutures,
    ]);

    return await results;
  });
}

async function deleteGroup(id) {
  return await GroupRepository.deleteGroup(id);
}

async function createGroup({ name, description, permissions = [] }) {
  return await db.transaction(async () => {
    const group = await GroupRepository.createGroup({ name, description });

    const permissionAddFutures = permissions.map(permission => GroupPermissionRepository.addPermissionToGroup(group.id, permission));

    const results = Promise.all([
      ...permissionAddFutures,
    ]);

    return await results;
  });
}

export default {
  getGroup,
  getGroups,
  editGroup,
  deleteGroup,
  createGroup,
  getGroupsForUser,
}