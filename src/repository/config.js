import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getConfig() {
  const query = squel.select()
  .from('config');

  const [metadata, results] = await db.query(query);

  return results;
}

async function createConfig(cfg_key,  cfg_value) {
  const query = squel.insert()
  .into('config')
  .set('cfg_key', cfg_key)
  .set('cfg_value', cfg_value);

  return await db.query(query);
}

async function deleteConfig(id) {
  const query = squel.delete()
  .from('config')
  .where('id = ?', id);

  return await db.query(query);
}

async function editConfig(id, cfg_key,  cfg_value) {
  const query = squel.update()
  .table('config')
  .set('cfg_key', cfg_key)
  .set('cfg_value', cfg_value)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getConfig, createConfig, deleteConfig, editConfig };