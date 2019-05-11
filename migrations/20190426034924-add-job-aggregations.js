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

const MigrationUtils = require('./util/migrationUtils');

exports.up = MigrationUtils.mySqlUp(async function(mySqlUtils) {
  const id = mySqlUtils.getIdField();
  await mySqlUtils.createTable(
    'job_aggregation',
    {
      id,
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

  await mySqlUtils.addIndex('job_aggregation', 'job_aggregation_index', ['parent_job_id', 'child_job_id'], true);
});

exports.down = MigrationUtils.mySqlDown(async function(mySqlUtils) {
  await mySqlUtils.dropTable('job_aggregation');
});

exports._meta = {
  "version": 1
};
