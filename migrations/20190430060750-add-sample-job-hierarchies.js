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

exports.up = async function(db) {
  const insert = promisify(db.insert.bind(db));

  await insert('job', ['id', 'title'], [1, 'Scientist']);


};

exports.down = async function(db) {
  const runSql = promisify(db.runSql.bind(db));
};

exports._meta = {
  "version": 1
};
