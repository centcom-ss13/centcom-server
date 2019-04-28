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

const { promisify, callbackify } = require('util');

exports.up = async function(db) {
  const createTable = promisify(db.createTable.bind(db));
  const addIndex = promisify(db.addIndex.bind(db));

  await createTable(
    'job_aggregation',
    {
      parent_job_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'job_aggregation_parent_job_id_fk',
          table: 'job',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      },
      child_job_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'job_aggregation_child_job_id_fk',
          table: 'job',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      },
    },
  );

  await addIndex('job_aggregation', 'job_aggregation_index', ['parent_job_id', 'child_job_id'], true);
};

exports.down = async function(db) {
  const dropTable = promisify((tableName, callback) => db.dropTable.call(db, tableName, { ifExists: true }, callback));

  await dropTable('job_aggregation');
};

exports._meta = {
  "version": 1
};
