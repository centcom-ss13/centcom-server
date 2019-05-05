import squel from 'squel';

import {getDB} from "../broker/database";
import {
  appendSelectLastInsertedObjectQuery,
  whitelistKeysInObject,
} from "../util/queryUtils";

const db = getDB();

async function getAuditLogs() {
  const query = squel.select()
  .from('audit_log');

  return await db.query(query);
}

async function createAuditLog(input) {
  const whitelistedInput = whitelistKeysInObject(input, ['action', 'user_id', 'failed', 'endpoint', 'value', 'timestamp']);
  const insertQuery = squel.insert()
  .into('audit_log')
  .setFields(whitelistedInput);

  const [, [insertedObject]] = await db.query(appendSelectLastInsertedObjectQuery(insertQuery, 'auditLog'));

  return insertedObject;
}
export default { getAuditLogs, createAuditLog };