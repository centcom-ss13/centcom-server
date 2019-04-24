import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getJobs() {
  const query = squel.select()
  .from('job');

  return await db.query(query);
}

async function createJob(title, aggregate) {
  const query = squel.insert()
  .into('job')
  .set('title', title)
  .set('aggregate', aggregate);

  return await db.query(query);
}

async function deleteJob(id) {
  const query = squel.delete()
  .from('job')
  .where('id = ?', id);

  return await db.query(query);
}

async function editJob(id, title, aggregate) {
  const query = squel.update()
  .table('job')
  .set('title', title)
  .set('aggregate', aggregate)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getJobs, createJob, deleteJob, editJob };