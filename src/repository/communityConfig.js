import squel from 'squel';

import {getDB} from "../broker/database";

const db = getDB();

async function getConfig() {
  const query = squel.select()
  .from('community_config');

  return await db.query(query);
}

async function createConfig(cfg_key, cfg_value) {
  const query = squel.insert()
  .into('community_config')
  .set('cfg_key', cfg_key)
  .set('cfg_value', cfg_value);

  return await db.query(query);
}

async function deleteConfig(cfg_key) {
  const query = squel.delete()
  .from('community_config')
  .where('cfg_key = ?', cfg_key);

  return await db.query(query);
}

async function editConfig(cfg_key, cfg_value) {
  const query = squel.update()
  .table('community_config')
  .set('cfg_value', cfg_value)
  .where('cfg_key = ?', cfg_key);

  return await db.query(query);
}

export default { getConfig, createConfig, deleteConfig, editConfig };