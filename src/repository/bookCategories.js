import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getBookCategories() {
  const query = squel.select()
  .from('book_category');

  return await db.query(query);
}

async function createBookCategory(name, color) {
  const query = squel.insert()
  .into('book_category')
  .set('name', name)
  .set('color', color);

  return await db.query(query);
}

async function deleteBookCategory(id) {
  const query = squel.delete()
  .from('book_category')
  .where('id = ?', id);

  return await db.query(query);
}

async function editBookCategory(id, name, color) {
  const query = squel.update()
  .table('book_category')
  .set('name', name)
  .set('color', color)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getBookCategories, createBookCategory, deleteBookCategory, editBookCategory };