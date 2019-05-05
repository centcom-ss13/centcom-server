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

  await createTable('audit_log', {
    id,
    action: {
      type: 'string',
      notNull: true,
      length: '200',
    },
    user_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'audit_log_user_id_fk',
        table: 'user',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT',
        },
        mapping: 'id',
      }
    },
    failed: {
      type: 'boolean',
      defaultValue: false,
    },
    endpoint: { //ex. "PUT /users/1/permissions"
      type: 'string',
      length: '200',
    },
    value: {
      type: 'string', //JSON string of associated data with the event
      length: '5000',
    },
    timestamp: {
      type: 'datetime',
      nonNull: true,
    }
  })
};

exports.down = async function(db) {
  const dropTable = promisify((tableName, callback) => db.dropTable.call(db, tableName, { ifExists: true }, callback));

  await dropTable('audit_log');
};

exports._meta = {
  "version": 1
};
