import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getPermissionsForGroup(group_id) {
  const query = squel.select()
  .field('permissions.id', 'id')
  .field('permissions.name', 'name')
  .field('permissions.description', 'description')
  .from('user_group_permissions')
  .left_join('permissions', null, 'user_group_permissions.permission_id = permissions.id')
  .where('user_group_permissions.group_id = ?', group_id);

  const [metadata, results] = await db.query(query);

  return results;
}

async function addPermissionToGroup(group_id, permission_id) {
  const query = squel.insert()
  .into('user_group_permissions')
  .set('group_id', group_id)
  .set('permission_id', permission_id);

  return await db.query(query);
}

async function removePermissionFromGroup(group_id, permission_id) {
  const query = squel.delete()
  .from('user_group_permissions')
  .where('group_id = ?', group_id)
  .where('permission_id = ?', permission_id);

  return await db.query(query);
}

export default {
  getPermissionsForGroup,
  addPermissionToGroup,
  removePermissionFromGroup,
};

