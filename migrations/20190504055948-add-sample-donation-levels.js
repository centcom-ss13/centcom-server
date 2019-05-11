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

async function addDonationLevel(mySqlUtils, id, name, cost, hide_cost = false, slider_name = null, description_name = null, style = '{}') {
  await mySqlUtils.runSql(`INSERT INTO donation_level (id, name, cost, hide_cost, slider_name, description_name, style) VALUES (${id}, '${name}', ${cost}, ${hide_cost}, ${slider_name ? `'${slider_name}'` : null}, ${description_name ? `'${description_name}'` : null}, ${style ? `'${style}'` : '{}'})`);
}

exports.up = MigrationUtils.mySqlUp(async function(mySqlUtils) {
  await addDonationLevel(mySqlUtils, 1, 'Backer', 5);
  await addDonationLevel(mySqlUtils, 2, 'Patron', 10);
  await addDonationLevel(mySqlUtils, 3, 'Supporter', 15);
  await addDonationLevel(mySqlUtils, 4, 'Super Supporter', 25);
  await addDonationLevel(mySqlUtils, 5, 'Mega Supporter', 50);
  await addDonationLevel(mySqlUtils, 6, 'Giga Supporter', 75);
  await addDonationLevel(mySqlUtils, 7, 'Ultimate Supporter', 100);
  await addDonationLevel(mySqlUtils, 8, 'Custom Donation', 125, true, 'And Byond!!!', null, '{ "color": "#02a401" }');
});

exports.down = MigrationUtils.mySqlDown(async function(mySqlUtils) {
  await mySqlUtils.runSql('DELETE FROM donation_level WHERE id BETWEEN 1 AND 8');
});

exports._meta = {
  "version": 1
};
