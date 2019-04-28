import squel from 'squel';

import {getDB} from "../broker/database";

const db = getDB();

async function getAllGroupMemberships() {
  const query = squel.select()
  .from('user_group_member');

  return await db.query(query);
}

async function getGroups() {
  const query = squel.select()
  .from('user_group');

  return await db.query(query);
}

async function getGroup(id) {
  const query = squel.select()
  .from('user_group')
  .where('id = ?', id);

  const results = await db.query(query);

  return results[0];
}

async function getGroupsForUser(userId) {
  const query = squel.select()
  .field('user_group.id', 'id')
  .field('user_group.name', 'name')
  .field('user_group.description', 'description')
  .from('user_group_member')
  .left_join('user_group', null, 'user_group.id = user_group_member.group_id')
  .where('user_group_member.user_id = ?', userId);

  return await db.query(query);
}

async function addUserToGroup(user_id, group_id) {
  const query = squel.insert()
  .into('user_group_member')
  .set('user_id', user_id)
  .set('group_id', group_id);

  return await db.query(query);
}

async function removeUserFromGroup(user_id, group_id) {
  const query = squel.delete()
  .from('user_group_member')
  .where('user_id = ?', user_id)
  .where('group_id = ?', group_id);

  return await db.query(query);
}

async function createGroup(name, description) {
  const createQuery = squel.insert()
  .into('user_group')
  .set('name', name)
  .set('description', description);

  await db.query(createQuery);

  const getCreatedObjectQuery = squel.select()
  .from('user_group')
  .where('id = LAST_INSERT_ID()');

  const results = await db.query(getCreatedObjectQuery);

  return results[0];
}

async function deleteGroup(id) {
  const query = squel.delete()
  .from('user_group')
  .where('id = ?', id);

  return await db.query(query);
}

async function editGroup(id, name, description) {
  const query = squel.update()
  .table('user_group')
  .set('name', name)
  .set('description', description)
  .where('id = ?', id);

  return await db.query(query);
}

export default {
  getGroups,
  getGroup,
  getGroupsForUser,
  addUserToGroup,
  removeUserFromGroup,
  createGroup,
  deleteGroup,
  editGroup,
  getAllGroupMemberships,
};

