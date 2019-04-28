import squel from 'squel';

import {getDB} from "../broker/database";

const db = getDB();

async function getPermissions() {
  const query = squel.select()
  .from('permission');

  return await db.query(query);
}

async function createPermission(name, description) {
  const query = squel.insert()
  .into('permission')
  .set('name', name)
  .set('description', description);

  return await db.query(query);
}

async function deletePermission(id) {
  const query = squel.delete()
  .from('permission')
  .where('id = ?', id);

  return await db.query(query);
}

async function editPermission(id, name, description) {
  const query = squel.update()
  .table('permission')
  .set('name', name)
  .set('description', description)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getPermissions, createPermission, deletePermission, editPermission };