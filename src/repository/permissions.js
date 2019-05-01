import squel from 'squel';

import {getDB} from "../broker/database";
import {
  appendSelectLastInsertedObjectQuery,
  whitelistKeysInObject,
} from "../util/queryUtils";

const db = getDB();

async function getPermissions() {
  const query = squel.select()
  .from('permission');

  return await db.query(query);
}

async function createPermission(input) {
  const whitelistedInput = whitelistKeysInObject(input, ['name', 'description']);
  const insertQuery = squel.insert()
  .into('permission')
  .setFields(whitelistedInput);

  const [, [insertedObject]] = await db.query(appendSelectLastInsertedObjectQuery(insertQuery, 'permission'));

  return insertedObject;
}

async function deletePermission(id) {
  const query = squel.delete()
  .from('permission')
  .where('id = ?', id);

  return await db.query(query);
}

async function editPermission(id, input) {
  const whitelistedInput = whitelistKeysInObject(input, ['name', 'description']);
  const query = squel.update()
  .table('permission')
  .setFields(whitelistedInput)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getPermissions, createPermission, deletePermission, editPermission };