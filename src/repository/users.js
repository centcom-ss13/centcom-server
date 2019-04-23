import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getUsers() {
  const query = squel.select()
  .from('users');

  const [metadata, results] = await db.query(query);

  return results;
}

async function getUser(id) {
  const query = squel.select()
  .from('users')
  .where(`id = ?`, id);

  const [metadata, results] = await db.query(query);

  return results[0];
}

async function createUser(nickname, email, byond_key) {
  const createQuery = squel.insert()
  .into('users')
  .set('nickname', nickname)
  .set('email', email)
  .set('byond_key', byond_key);

  await db.query(createQuery);

  const getCreatedObjectQuery = squel.select()
  .from('users')
  .where('id = LAST_INSERT_ID()');

  const [metadata, results] = await db.query(getCreatedObjectQuery);

  return results[0];
}

async function deleteUser(id) {
  const query = squel.delete()
  .from('users')
  .where(`id = ?`, id);

  return await db.query(query);
}

async function editUser(id, nickname, email, byond_key) {
  const query = squel.update()
  .table('users')
  .set('nickname', nickname)
  .set('email', email)
  .set('byond_key', byond_key)
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

