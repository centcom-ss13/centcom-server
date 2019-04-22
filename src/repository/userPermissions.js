import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getPermissionsForUser(user_id) {
  const query = squel.select()
  .field('permissions.id', 'id')
  .field('permissions.name', 'name')
  .field('permissions.description', 'description')
  .from('user_permissions')
  .left_join('permissions', null, 'user_permissions.permission_id = permissions.id')
  .where('user_permissions.user_id = ?', user_id);

  const [metadata, results] = await db.query(query);

  return results;
}

async function addPermissionToUser(user_id, permission_id) {
  const query = squel.insert()
  .into('user_permissions')
  .set('user_id', user_id)
  .set('permission_id', permission_id);

  return await db.query(query);
}

async function removePermissionFromUser(user_id, permission_id) {
  const query = squel.delete()
  .from('user_permissions')
  .where('user_id = ?', user_id)
  .where('permission_id = ?', permission_id);

  return await db.query(query);
}

export default {
  getPermissionsForUser,
  addPermissionToUser,
  removePermissionFromUser,
};

