import squel from 'squel';

import {getDB} from "../broker/database";

const db = getDB();

async function getAllGroupPermissions() {
  const query = squel.select()
  .from('user_group_permission');

  return await db.query(query);
}

async function getPermissionsForGroup(group_id) {
  const query = squel.select()
  .from('user_group_permission')
  .where('user_group_permission.group_id = ?', group_id);

  const results = await db.query(query);

  return results.map(({ permission }) => permission);
}

async function addPermissionToGroup(group_id, permission) {
  const query = squel.insert()
  .into('user_group_permission')
  .set('group_id', group_id)
  .set('permission', permission);

  return await db.query(query);
}

async function removePermissionFromGroup(group_id, permission) {
  const query = squel.delete()
  .from('user_group_permission')
  .where('group_id = ?', group_id)
  .where('permission = ?', permission);

  return await db.query(query);
}

export default {
  getPermissionsForGroup,
  addPermissionToGroup,
  removePermissionFromGroup,
  getAllGroupPermissions,
};

