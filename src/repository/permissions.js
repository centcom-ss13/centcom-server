import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getPermissions() {
  const query = squel.select()
  .from('permissions');

  const results = await db.query(query);

  return results[1];
}

async function createPermission(name, description) {
  const query = squel.insert()
  .into('permissions')
  .set('name', name)
  .set('description', description);

  return await db.query(query);
}

async function deletePermission(id) {
  const query = squel.delete()
  .from('permissions')
  .where('id = ?', id);

  return await db.query(query);
}

async function editPermission(id, name, description) {
  const query = squel.update()
  .table('permissions')
  .set('name', name)
  .set('description', description)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getPermissions, createPermission, deletePermission, editPermission };