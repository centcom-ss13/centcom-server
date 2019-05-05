import squel from 'squel';

import {getDB} from "../broker/database";
import {
  appendSelectLastInsertedObjectQuery,
  whitelistKeysInObject,
} from "../util/queryUtils";

const db = getDB();

async function getAllJobBans() {
  const query = squel.select()
  .from('job_ban');

  return await db.query(query);
}

async function getJobBans(ban_id) {
  const query = squel.select()
  .field('job.id', 'id')
  .field('job.title', 'title')
  .from('job_ban')
  .left_join('job', null, 'job_ban.job_id = job.id')
  .where('job_ban.ban_id = ?', ban_id);

  return await db.query(query);
}

async function addJobBan(ban_id, job_id) {
  const query = squel.insert()
  .into('job_ban')
  .set('ban_id', ban_id)
  .set('job_id', job_id);

  return await db.query(query);
}

async function removeJobBan(ban_id, job_id) {
  const query = squel.delete()
  .from('job_ban')
  .where('ban_id = ?', ban_id)
  .where('job_id = ?', job_id);

  return await db.query(query);
}

export default {
  getAllJobBans,
  getJobBans,
  addJobBan,
  removeJobBan,
};

