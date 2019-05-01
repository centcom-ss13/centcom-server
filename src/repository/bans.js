import squel from 'squel';

import {getDB} from "../broker/database";
import {
  appendSelectLastInsertedObjectQuery,
  whitelistKeysInObject,
} from "../util/queryUtils";

const db = getDB();

async function getBans() {
  const query = squel.select()
  .from('ban');

  return await db.query(query);
}

async function createBan(input) {
  const whitelistedInput = whitelistKeysInObject(input, ['byond_key', 'reason', 'expiration_date', 'ip', 'computer_id', 'issuer_id']);
  const insertQuery = squel.insert()
  .into('ban')
  .setFields(whitelistedInput);

  const [, [insertedObject]] = await db.query(appendSelectLastInsertedObjectQuery(insertQuery, 'ban'));

  return insertedObject;
}

async function deleteBan(id) {
  const query = squel.delete()
  .from('ban')
  .where('id = ?', id);

  return await db.query(query);
}

async function editBan(id, input) {
  const whitelistedInput = whitelistKeysInObject(input, ['byond_key', 'reason', 'expiration_date', 'ip', 'computer_id', 'issuer_id']);
  const query = squel.update()
  .table('ban')
  .setFields(whitelistedInput)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getBans, createBan, deleteBan, editBan };