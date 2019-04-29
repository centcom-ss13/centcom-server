import squel from "squel/dist/squel";

const appendSelectLastInsertedObjectQuery = (query, table) => query.toString().concat(';').concat(
  squel.select().from(table).where('id = LAST_INSERT_ID()').toString()
);

export {
  appendSelectLastInsertedObjectQuery,
};