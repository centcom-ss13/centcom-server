import squel from "squel/dist/squel";

const appendSelectLastInsertedObjectQuery = (query, table) => query.toString().concat(';').concat(
  squel.select().from(table).where('id = LAST_INSERT_ID()').toString()
);

const stripUndefinedValuesFromObject = (object) => Object.entries(object)
.reduce(([output, [key, value]]) => ({
  ...output,
  ...(value !== undefined && { [key]: value }),
}), {});

const stripKeysFromObject = (object, stripKeys = []) => Object.entries(object)
.reduce((output, [key, value]) => ({
  ...output,
  ...(!stripKeys.includes(key) && { [key]: value }),
}), {});

const whitelistKeysInObject = (object, whitelistKeys = []) => Object.entries(object)
.reduce((output, [key, value]) => ({
  ...output,
  ...(whitelistKeys.includes(key) && value !== undefined && { [key]: value }),
}), {});

export {
  appendSelectLastInsertedObjectQuery,
  stripUndefinedValuesFromObject,
  stripKeysFromObject,
  whitelistKeysInObject,
};