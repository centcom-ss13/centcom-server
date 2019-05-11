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

async function addJob(mySqlUtils, title, aggregate = 0, antag = 0) {
  await mySqlUtils.runSql(`INSERT INTO job (title, aggregate, antag) VALUES ('${title}', '${aggregate}', '${antag}')`);
  // const insert = promisify(db.insert.bind(db));
  // await insert('job', ['id', 'title', 'aggregate'], [id, title, aggregate]);
}

async function addJobAggregations(mySqlUtils, parentJobId, childJobIds) {
  await Promise.all(childJobIds.map((childJobId) =>
    mySqlUtils.runSql(`INSERT INTO job_aggregation (parent_job_id, child_job_id) VALUES (${parentJobId}, ${childJobId})`)));
  // const insert = promisify(db.insert.bind(db));
  // await Promise.all(childJobIds.map((childJobId) =>
  //   insert('job_aggregation', ['id', 'parent_job_id', 'child_job_id'], [id, parentJobId, childJobId])));
}

exports.up = MigrationUtils.mySqlUp(async function(mySqlUtils) {
  await mySqlUtils.runSql('DELETE FROM job_aggregation WHERE 1=1');
  await mySqlUtils.runSql('DELETE FROM job WHERE 1=1');

  await Promise.all([
    addJob(mySqlUtils, 'Scientist'), //1
    addJob(mySqlUtils, 'Roboticist'), //2
    addJob(mySqlUtils, 'Research Director'), //3
    addJob(mySqlUtils, 'Department - Science', 1), //4
    addJob(mySqlUtils, 'Doctor'), //5
    addJob(mySqlUtils, 'Chemist'), //6
    addJob(mySqlUtils, 'Psychiatrist'), //7
    addJob(mySqlUtils, 'Geneticist'), //8
    addJob(mySqlUtils, 'Virologist'), //9
    addJob(mySqlUtils, 'Chief Medical Officer'), //10
    addJob(mySqlUtils, 'Department - Medical', 1), //11
    addJob(mySqlUtils, 'Chef'), //12
    addJob(mySqlUtils, 'Botanist'), //13
    addJob(mySqlUtils, 'Bartender'), //14
    addJob(mySqlUtils, 'Librarian'), //15
    addJob(mySqlUtils, 'Clown'), //16
    addJob(mySqlUtils, 'Mime'), //17
    addJob(mySqlUtils, 'Chaplain'), //18
    addJob(mySqlUtils, 'Janitor'), //19
    addJob(mySqlUtils, 'Lawyer'), //20
    addJob(mySqlUtils, 'Head of Personnel'), //21
    addJob(mySqlUtils, 'Department - Service', 1), //22
    addJob(mySqlUtils, 'Security Officer'), //23
    addJob(mySqlUtils, 'Investigator'), //24
    addJob(mySqlUtils, 'Warden'), //25
    addJob(mySqlUtils, 'Head of Security'), //26
    addJob(mySqlUtils, 'Department - Security', 1), //27
    addJob(mySqlUtils, 'Station Engineer'), //28
    addJob(mySqlUtils, 'Atmospheric Technician'), //29
    addJob(mySqlUtils, 'Chief Engineer'), //30
    addJob(mySqlUtils, 'Department - Engineering', 1), //31
    addJob(mySqlUtils, 'Cargo Technician'), //32
    addJob(mySqlUtils, 'Shaft Miner'), //33
    addJob(mySqlUtils, 'Quatermaster'), //34
    addJob(mySqlUtils, 'Department - Cargo', 1), //35
    addJob(mySqlUtils, 'Captain'), //36
    addJob(mySqlUtils, 'Assistant'), //37
    addJob(mySqlUtils, 'Head Roles', 1), //38
    addJob(mySqlUtils, 'Non-Productive Roles', 1), //39
    addJob(mySqlUtils, 'All Crew Jobs', 1), //40
    addJob(mySqlUtils, 'Traitor', 0, 1), //41
    addJob(mySqlUtils, 'Changeling', 0, 1), //42
    addJob(mySqlUtils, 'Nuclear Operative', 0, 1), //43
    addJob(mySqlUtils, 'Blood Cultist', 0, 1), //44
    addJob(mySqlUtils, 'Clockwork Cultist', 0, 1), //45
    addJob(mySqlUtils, 'Revolutionary', 0, 1), //46
    addJob(mySqlUtils, 'Gangster', 0, 1), //47
    addJob(mySqlUtils, 'Wizard', 0, 1), //48
    addJob(mySqlUtils, 'Ragin Mages', 0, 1), //49
    addJob(mySqlUtils, 'Shadowling', 0, 1), //50
    addJob(mySqlUtils, 'Syndicate Mutineer', 0, 1), //51
    addJob(mySqlUtils, 'Hivemind Host', 0, 1), //52
    addJob(mySqlUtils, 'Vampire', 0, 1), //53
    addJob(mySqlUtils, 'Xenomorph', 0, 1), //54
    addJob(mySqlUtils, 'Space Ninja', 0, 1), //55
    addJob(mySqlUtils, 'Blob', 0, 1), //56
    addJob(mySqlUtils, 'Abductor', 0, 1), //57
    addJob(mySqlUtils, 'Pirate', 0, 1), //58
    addJob(mySqlUtils, 'Sentient Disease', 0, 1), //59
    addJob(mySqlUtils, 'Morph', 0, 1), //60
    addJob(mySqlUtils, 'Revenant', 0, 1), //61
    addJob(mySqlUtils, 'Swarmer', 0, 1), //62
    addJob(mySqlUtils, 'All Antag Roles', 1, 1), //63
  ]);

  await Promise.all([
    addJobAggregations(mySqlUtils, 4, [1, 2, 3, 8]),
    addJobAggregations(mySqlUtils, 11, [5, 6, 7, 8, 9, 10]),
    addJobAggregations(mySqlUtils, 22, [12, 13, 14, 15, 16, 17, 18, 19, 20, 21]),
    addJobAggregations(mySqlUtils, 27, [23, 24, 25, 26]),
    addJobAggregations(mySqlUtils, 31, [28, 29, 30]),
    addJobAggregations(mySqlUtils, 35, [32, 33, 34]),
    addJobAggregations(mySqlUtils, 38, [3, 10, 21, 26, 30, 36]),
    addJobAggregations(mySqlUtils, 39, [37, 16, 20, 15, 17, 7]),
    addJobAggregations(mySqlUtils, 40, [1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 28, 29, 30, 32, 33, 34, 36, 37]),
    addJobAggregations(mySqlUtils, 63, [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]),
  ]);
});

exports.down = MigrationUtils.mySqlDown(async function(mySqlUtils) {
  await mySqlUtils.runSql('DELETE FROM job_aggregation WHERE id BETWEEN 1 AND 10');
  await mySqlUtils.runSql('DELETE FROM job WHERE id BETWEEN 1 AND 40');
});

exports._meta = {
  "version": 1
};
