'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const id = {
  type: 'int',
  notNull: true,
  primaryKey: true,
  autoIncrement: true,
};

const { promisify } = require('util');

exports.up = async function(db) {
  const createTable = promisify(db.createTable.bind(db));

  await createTable('donation_level',
    {
      id,
      name: {
        type: 'string',
        notNull: true,
        unique: true,
      },
      cost: {
        type: 'int',
        unique: true,
      },
      hide_cost: {
        type: 'boolean',
        defaultValue: false,
      },
      slider_name: {
        type: 'string',
      },
      description_name: {
        type: 'string',
      },
      style: {
        type: 'string',
        length: 5000,
        //this is super jank, but this will accept an optional json string with a JSX style object
        //I'll be setting up some extreme validation of the JSON object.  No nested objects, arrays, or functions, input must be an object, and probably whitelisted CSS keys
      },
    });
};

exports.down = async function(db) {
  const dropTable = promisify((tableName, callback) => db.dropTable.call(db, tableName, { ifExists: true }, callback));

  await dropTable('donation_level')
};

exports._meta = {
  "version": 1
};
