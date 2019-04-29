import squel from 'squel';

import {getDB} from "../broker/database";
import { appendSelectLastInsertedObjectQuery } from "../util/queryUtils";

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

async function createBook(title, content, category_id) {
  const insertQuery = squel.insert()
  .into('book')
  .set('title', title)
  .set('content', content)
  .set('category_id', category_id);

  const [, [insertedObject]] = await db.query(appendSelectLastInsertedObjectQuery(insertQuery, 'book'));

  return insertedObject;
}

async function deleteBook(id) {
  const query = squel.delete()
  .from('book')
  .where('id = ?', id);

  return await db.query(query);
}

async function editBook(id, title, content, category_id) {
  const query = squel.update()
  .table('book')
  .set('title', title)
  .set('content', content)
  .set('category_id', category_id)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getBooks, createBook, deleteBook, editBook };