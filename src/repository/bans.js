import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getBans() {
  const query = squel.select()
  .from('bans');

  const [metadata, results] = await db.query(query);

  return results;
}

async function createBan(byond_key, reason, expiration_date, ip, computer_id, issuer_id) {
  const query = squel.insert()
  .into('bans')
  .set('byond_key', byond_key)
  .set('reason', reason)
  .set('expiration_date', expiration_date)
  .set('ip', ip)
  .set('computer_id', computer_id)
  .set('issuer_id', issuer_id);

  return await db.query(query);
}

async function deleteBan(id) {
  const query = squel.delete()
  .from('bans')
  .where('id = ?', id);

  return await db.query(query);
}

async function editBan(id, byond_key, reason, expiration_date, ip, computer_id) {
  const query = squel.update()
  .table('bans')
  .set('byond_key', byond_key)
  .set('reason', reason)
  .set('expiration_date', expiration_date)
  .set('ip', ip)
  .set('computer_id', computer_id)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getBans, createBan, deleteBan, editBan };