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
  await mySqlUtils.createTable('default_permissions', {
    id,
    user_type: {
      type: 'string', // current acceptable values are "GUEST" and "USER",
    },
    permission: {
      type: 'string', //Acceptable values are keys of the permissions repository
    },
  });
});

exports.down = MigrationUtils.mySqlDown(async function(mySqlUtils) {
  await mySqlUtils.dropTable('default_permissions');
});

exports._meta = {
  "version": 1
};
