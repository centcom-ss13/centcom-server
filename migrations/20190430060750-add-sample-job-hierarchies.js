'use strict';

var dbm;
var type;
var seed;

const { promisify } = require('util');

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

async function addJob(db, title, aggregate = 0) {
  const runSql = promisify(db.runSql.bind(db));
  await runSql(`INSERT INTO job (title, aggregate) VALUES ('${title}', '${aggregate}')`);
  // const insert = promisify(db.insert.bind(db));
  // await insert('job', ['id', 'title', 'aggregate'], [id, title, aggregate]);
}

async function addJobAggregations(db, parentJobId, childJobIds) {
  const runSql = promisify(db.runSql.bind(db));
  await Promise.all(childJobIds.map((childJobId) =>
    runSql(`INSERT INTO job_aggregation (parent_job_id, child_job_id) VALUES (${parentJobId}, ${childJobId})`)));
  // const insert = promisify(db.insert.bind(db));
  // await Promise.all(childJobIds.map((childJobId) =>
  //   insert('job_aggregation', ['id', 'parent_job_id', 'child_job_id'], [id, parentJobId, childJobId])));
}

exports.up = async function(db) {
  const runSql = promisify(db.runSql.bind(db));

  await runSql('DELETE FROM job_aggregation WHERE 1=1');
  await runSql('DELETE FROM job WHERE 1=1');

  await Promise.all([
    addJob(db, 'Scientist'),
    addJob(db, 'Roboticist'),
    addJob(db, 'Research Director'),
    addJob(db, 'Department - Science', 1),
    addJob(db, 'Doctor'),
    addJob(db, 'Chemist'),
    addJob(db, 'Psychiatrist'),
    addJob(db, 'Chief Medical Officer'),
    addJob(db, 'Department - Medical', 1),
    addJob(db,  'Chef'),
    addJob(db,  'Botanist'),
    addJob(db,  'Head of Personnel'),
    addJob(db,  'Department - Service', 1),
    addJob(db,  'Security Officer'),
    addJob(db,  'Inspector'),
    addJob(db,  'Warden'),
    addJob(db,  'Head of Security'),
    addJob(db,  'Department - Security', 1),
    addJob(db,  'Station Engineer'),
    addJob(db,  'Atmospheric Technician'),
    addJob(db,  'Chief Engineer'),
    addJob(db,  'Department - Engineering', 1),
    addJob(db,  'Captain'),
    addJob(db,  'Head Roles', 1),
    addJob(db,  'All Jobs', 1),
  ]);

  await Promise.all([
    addJobAggregations(db, 4, [1, 2, 3]),
    addJobAggregations(db, 9, [5, 6, 7, 8]),
    addJobAggregations(db, 13, [10, 11, 12]),
    addJobAggregations(db, 18, [14, 15, 16, 17]),
    addJobAggregations(db, 22, [19, 20, 21]),
    addJobAggregations(db, 24, [3, 8, 12, 17, 21, 23]),
    addJobAggregations(db, 25, [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 19, 20, 21, 23]),
  ]);
};

exports.down = async function(db) {
  const runSql = promisify(db.runSql.bind(db));

  await runSql('DELETE FROM job_aggregation WHERE id BETWEEN 1 AND 7');
  await runSql('DELETE FROM job WHERE id BETWEEN 1 AND 25');
};

exports._meta = {
  "version": 1
};
