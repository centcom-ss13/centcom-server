import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getAllUserPermissions() {
  const query = squel.select()
  .from('user_permission');

  return await db.query(query);
}

async function getPermissionsForUser(user_id) {
  const query = squel.select()
  .field('permission.id', 'id')
  .field('permission.name', 'name')
  .field('permission.description', 'description')
  .from('user_permission')
  .left_join('permission', null, 'user_permission.permission_id = permission.id')
  .where('user_permission.user_id = ?', user_id);

  return await db.query(query);
}

async function addPermissionToUser(user_id, permission_id) {
  const query = squel.insert()
  .into('user_permission')
  .set('user_id', user_id)
  .set('permission_id', permission_id);

  return await db.query(query);
}

async function removePermissionFromUser(user_id, permission_id) {
  const query = squel.delete()
  .from('user_permission')
  .where('user_id = ?', user_id)
  .where('permission_id = ?', permission_id);

  return await db.query(query);
}

export default {
  getPermissionsForUser,
  addPermissionToUser,
  removePermissionFromUser,
  getAllUserPermissions,
};

