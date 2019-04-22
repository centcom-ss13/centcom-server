import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getBooks() {
  const query = squel.select()
  .field('books.id')
  .field('books.title')
  .field('books.content')
  .field('books.category_id')
  .field('book_categories.name', 'category_name')
  .from('books')
  .left_join('book_categories', null, "books.category_id = book_categories.id");

  const results = await db.query(query);

  return results[1];
}

async function createBook(title, content, category_id) {
  const query = squel.insert()
  .into('books')
  .set('title', title)
  .set('content', content)
  .set('category_id', category_id);

  return await db.query(query);
}

async function deleteBook(id) {
  const query = squel.delete()
  .from('books')
  .where('id = ?', id);

  return await db.query(query);
}

async function editBook(id, title, content, category_id) {
  const query = squel.update()
  .table('books')
  .set('title', title)
  .set('content', content)
  .set('category_id', category_id)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getBooks, createBook, deleteBook, editBook };