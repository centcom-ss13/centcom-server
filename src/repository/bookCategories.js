import squel from 'squel';

import {getDB} from "../broker/database";
import {
  appendSelectLastInsertedObjectQuery,
  whitelistKeysInObject,
} from "../util/queryUtils";

const db = getDB();

async function getBookCategories() {
  const query = squel.select()
  .from('book_category');

  return await db.query(query);
}

async function createBookCategory(input) {
  const whitelistedInput = whitelistKeysInObject(input, ['name', 'color']);
  const insertQuery = squel.insert()
  .into('book_category')
  .setFields(whitelistedInput);

  const [, [insertedObject]] = await db.query(appendSelectLastInsertedObjectQuery(insertQuery, 'book_category'));

  return insertedObject;
}

async function deleteBookCategory(id) {
  const query = squel.delete()
  .from('book_category')
  .where('id = ?', id);

  return await db.query(query);
}

async function editBookCategory(id, input) {
  const whitelistedInput = whitelistKeysInObject(input, ['name', 'color']);
  const query = squel.update()
  .table('book_category')
  .setFields(whitelistedInput)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getBookCategories, createBookCategory, deleteBookCategory, editBookCategory };