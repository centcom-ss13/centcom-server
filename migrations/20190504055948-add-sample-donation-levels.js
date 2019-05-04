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

const { promisify } = require('util');

async function addDonationLevel(db, id, name, cost, hide_cost = false, slider_name = null, description_name = null, style = '{}') {
  const runSql = promisify(db.runSql.bind(db));

  await runSql(`INSERT INTO donation_level (id, name, cost, hide_cost, slider_name, description_name, style) VALUES (${id}, '${name}', ${cost}, ${hide_cost}, ${slider_name ? `'${slider_name}'` : null}, ${description_name ? `'${description_name}'` : null}, ${style ? `'${style}'` : '{}'})`);
}

exports.up = async function(db) {
  await addDonationLevel(db, 1, 'Backer', 5);
  await addDonationLevel(db, 2, 'Patron', 10);
  await addDonationLevel(db, 3, 'Supporter', 15);
  await addDonationLevel(db, 4, 'Super Supporter', 25);
  await addDonationLevel(db, 5, 'Mega Supporter', 50);
  await addDonationLevel(db, 6, 'Giga Supporter', 75);
  await addDonationLevel(db, 7, 'Ultimate Supporter', 100);
  await addDonationLevel(db, 8, 'Custom Donation', 125, true, 'And Byond!!!', null, '{ "color": "#02a401" }');
};

exports.down = async function(db) {
  const runSql = promisify(db.runSql.bind(db));

  await runSql('DELETE FROM donation_level WHERE id BETWEEN 1 AND 8');
};

exports._meta = {
  "version": 1
};
