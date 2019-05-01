import squel from 'squel';

import {getDB} from "../broker/database";
import {
  appendSelectLastInsertedObjectQuery,
  whitelistKeysInObject,
} from "../util/queryUtils";

const db = getDB();

async function getUsers() {
  const query = squel.select()
  .from('user');

  return await db.query(query);
}

async function getUser(id) {
  const query = squel.select()
  .from('user')
  .where(`id = ?`, id);

  const results = await db.query(query);

  return results[0];
}

async function createUser(input) {
  const whitelistedInput = whitelistKeysInObject(input, ['nickname', 'email', 'byond_key']);
  const insertQuery = squel.insert()
  .into('user')
  .setFields(whitelistedInput);

  const [, [insertedObject]] = await db.query(appendSelectLastInsertedObjectQuery(insertQuery, 'user'));

  return insertedObject;
}

async function deleteUser(id) {
  const query = squel.delete()
  .from('user')
  .where(`id = ?`, id);

  return await db.query(query);
}

async function editUser(id, input) {
  const whitelistedInput = whitelistKeysInObject(input, ['nickname', 'email', 'byond_key']);
  const query = squel.update()
  .table('user')
  .setFields(whitelistedInput)
  .where(`id = ?`, id);

  return await db.query(query);
}

export default {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  editUser,
};

