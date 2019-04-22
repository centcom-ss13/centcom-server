import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getBookCategories() {
  const query = squel.select()
  .from('book_categories');

  const results = await db.query(query);

  return results[1];
}

async function createBookCategory(name, color) {
  const query = squel.insert()
  .into('book_categories')
  .set('name', name)
  .set('color', color);

  return await db.query(query);
}

async function deleteBookCategory(id) {
  const query = squel.delete()
  .from('book_categories')
  .where('id = ?', id);

  return await db.query(query);
}

async function editBookCategory(id, name, color) {
  const query = squel.update()
  .table('book_categories')
  .set('name', name)
  .set('color', color)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getBookCategories, createBookCategory, deleteBookCategory, editBookCategory };