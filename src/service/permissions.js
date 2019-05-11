import UserPermissionRepository from '../repository/userPermissions';
import GroupRepository from '../repository/userGroups';
import GroupPermissionRepository from '../repository/userGroupPermissions';
import permissions from '../repository/permissions';

async function getDerivedUserPermissions(user_id) {
  const [
    userPermissions,
    userGroups,
    allUserGroupPermissions,
  ] = await Promise.all([
    UserPermissionRepository.getPermissionsForUser(user_id),
    GroupRepository.getGroupsForUser(user_id),
    GroupPermissionRepository.getAllGroupPermissions(),
  ]);

  const aggregatedPermissions = Array.from(new Set([
    ...userPermissions,
    ...allUserGroupPermissions
      .filter(({ group_id }) =>
        userGroups
          .map(({ id }) => id)
          .includes(group_id))
      .map(({ permission }) => permission)
      .reduce((acc, cur) => ([...acc, ...cur]), []),
  ]));

  return aggregatedPermissions;
}

function getPermissions() {
  return permissions;
}


export default {
  getDerivedUserPermissions,
  getPermissions,
};