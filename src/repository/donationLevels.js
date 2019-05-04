import squel from 'squel';

import { getDB } from "../broker/database";
import {
  appendSelectLastInsertedObjectQuery,
  whitelistKeysInObject,
} from "../util/queryUtils";

const db = getDB();

async function getDonationLevels() {
  const query = squel.select()
  .from('donation_level');

  return await db.query(query);
}

async function createDonationLevel(input) {
  const whitelistedInput = whitelistKeysInObject(input, ['name', 'cost', 'hide_cost', 'slider_name', 'description_name', 'style']);
  const insertQuery = squel.insert()
  .into('donation_level')
  .setFields(whitelistedInput);

  const [, [insertedObject]] = await db.query(appendSelectLastInsertedObjectQuery(insertQuery, 'donation_level'));

  return insertedObject;
}

async function deleteDonationLevel(id) {
  const query = squel.delete()
  .from('donation_level')
  .where('id = ?', id);

  return await db.query(query);
}

async function editDonationLevel(id, input) {
  const whitelistedInput = whitelistKeysInObject(input, ['name', 'cost', 'hide_cost', 'slider_name', 'description_name', 'style']);
  const query = squel.update()
  .table('donation_level')
  .setFields(whitelistedInput)
  .where('id = ?', id);

  return await db.query(query);
}

export default { getDonationLevels, createDonationLevel, deleteDonationLevel, editDonationLevel };
