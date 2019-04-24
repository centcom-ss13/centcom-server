import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getAllGroupPermissions() {
  const query = squel.select()
  .from('user_group_permission');

  return await db.query(query);
}

async function getPermissionsForGroup(group_id) {
  const query = squel.select()
  .field('permission.id', 'id')
  .field('permission.name', 'name')
  .field('permission.description', 'description')
  .from('user_group_permission')
  .left_join('permission', null, 'user_group_permission.permission_id = permission.id')
  .where('user_group_permission.group_id = ?', group_id);

  return await db.query(query);
}

async function addPermissionToGroup(group_id, permission_id) {
  const query = squel.insert()
  .into('user_group_permission')
  .set('group_id', group_id)
  .set('permission_id', permission_id);

  return await db.query(query);
}

async function removePermissionFromGroup(group_id, permission_id) {
  const query = squel.delete()
  .from('user_group_permission')
  .where('group_id = ?', group_id)
  .where('permission_id = ?', permission_id);

  return await db.query(query);
}

export default {
  getPermissionsForGroup,
  addPermissionToGroup,
  removePermissionFromGroup,
  getAllGroupPermissions,
};

