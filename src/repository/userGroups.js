import squel from 'squel';

import {DB} from "../broker/database";

const db = new DB();

async function getAllGroupMemberships() {
  const query = squel.select()
  .from('user_group_members');

  const [metadata, results] = await db.query(query);

  return results;
}

async function getGroups() {
  const query = squel.select()
  .from('user_groups');

  const [metadata, results] = await db.query(query);

  return results;
}

async function getGroup(id) {
  const query = squel.select()
  .from('user_groups')
  .where('id = ?', id);

  const [metadata, results] = await db.query(query);

  return results[0];
}

async function getGroupsForUser(userId) {
  const query = squel.select()
  .field('user_groups.id', 'id')
  .field('user_groups.name', 'name')
  .field('user_groups.description', 'description')
  .from('user_group_members')
  .left_join('user_groups', null, 'user_groups.id = user_group_members.group_id')
  .where('user_group_members.user_id = ?', userId);

  const [metadata, results] = await db.query(query);

  return results;
}

async function addUserToGroup(user_id, group_id) {
  const query = squel.insert()
  .into('user_group_members')
  .set('user_id', user_id)
  .set('group_id', group_id);

  return await db.query(query);
}

async function removeUserFromGroup(user_id, group_id) {
  const query = squel.delete()
  .from('user_group_members')
  .where('user_id = ?', user_id)
  .where('group_id = ?', group_id);

  return await db.query(query);
}

async function createGroup(name, description) {
  const query = squel.insert()
  .into('user_groups')
  .set('name', name)
  .set('description', description);

  return await db.query(query);
}

async function deleteGroup(id) {
  const query = squel.delete()
  .from('user_groups')
  .where('id = ?', id);

  return await db.query(query);
}

async function editGroup(id, name, description) {
  const query = squel.update()
  .table('user_groups')
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

