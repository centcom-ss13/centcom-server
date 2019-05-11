import squel from 'squel';

import {getDB} from "../broker/database";
import {
  appendSelectLastInsertedObjectQuery,
  whitelistKeysInObject,
} from "../util/queryUtils";

const db = getDB();

async function getAllUserPermissions() {
  const query = squel.select()
  .from('user_permission');

  return await db.query(query);
}

async function getPermissionsForUser(user_id) {
  const query = squel.select()
  .from('user_permission')
  .where('user_permission.user_id = ?', user_id);

  const results = await db.query(query);

  return results.map(({ permission }) => permission);
}

async function addPermissionToUser(user_id, permission) {
  const query = squel.insert()
  .into('user_permission')
  .set('user_id', user_id)
  .set('permission', permission);

  return await db.query(query);
}

async function removePermissionFromUser(user_id, permission) {
  const query = squel.delete()
  .from('user_permission')
  .where('user_id = ?', user_id)
  .where('permission = ?', permission);

  return await db.query(query);
}

export default {
  getPermissionsForUser,
  addPermissionToUser,
  removePermissionFromUser,
  getAllUserPermissions,
};

