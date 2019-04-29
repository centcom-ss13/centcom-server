import squel from 'squel';

import { getDB } from "../broker/database";
import { appendSelectLastInsertedObjectQuery } from "../util/queryUtils";

const db = getDB();

async function getJobs() {
  const query = squel.select()
  .from('job');

  return await db.query(query);
}

async function createJob(title, aggregate) {
  const insertQuery = squel.insert()
  .into('job')
  .set('title', title)
  .set('aggregate', aggregate).toString();

  const [, [insertedObject]] = await db.query(appendSelectLastInsertedObjectQuery(insertQuery, 'job'));

  return insertedObject;
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

async function getChildJobs(id) {
  const query = squel.select()
  .from('job_aggregation')
  .where('parent_job_id = ?', id);

  return await db.query(query);
}

async function addChildJob(parentId, childId) {
  const query = squel.insert()
  .into('job_aggregation')
  .set('parent_job_id', parentId)
  .set('child_job_id', childId);

  return await db.query(query);
}

async function removeChildJob(parentId, childId) {
  const query = squel.delete()
  .from('job_aggregation')
  .where('parent_job_id = ?', parentId)
  .where('child_job_id = ?', childId);

  return await db.query(query);
}

export default { getJobs, createJob, deleteJob, editJob, addChildJob, removeChildJob, getChildJobs };
