import squel from 'squel';

import {getDB} from "../broker/database";
import {
  appendSelectLastInsertedObjectQuery,
  whitelistKeysInObject,
} from "../util/queryUtils";

const db = getDB();

async function getBooks() {
  const query = squel.select()
  .field('book.id')
  .field('book.title')
  .field('book.content')
  .field('book.category_id')
  .field('book_category.name', 'category_name')
  .from('book')
  .left_join('book_category', null, "book.category_id = book_category.id");

  return await db.query(query);
}

async function createBook(input) {
  const whitelistedInput = whitelistKeysInObject(input, ['title', 'content', 'category_id']);
  const insertQuery = squel.insert()
  .into('book')
  .setFields(whitelistedInput);

  const [, [insertedObject]] = await db.query(appendSelectLastInsertedObjectQuery(insertQuery, 'book'));

  return insertedObject;
}

async function deleteBook(id) {
  const query = squel.delete()
  .from('book')
  .where('id = ?', id);

  return await db.query(query);
}

async function editBook(id, input) {
  const whitelistedInput = whitelistKeysInObject(input, ['title', 'content', 'category_id']);
  const query = squel.update()
  .table('book')
  .setFields(whitelistedInput)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getBooks, createBook, deleteBook, editBook };