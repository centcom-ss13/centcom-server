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

async function setConfig(mySqlUtils, key, value) {
  await mySqlUtils.runSql(`INSERT INTO community_config (cfg_key, cfg_value) VALUES ('${key}', '${value}')`);
}

exports.up = MigrationUtils.mySqlUp(async function(mySqlUtils) {
  await setConfig(mySqlUtils, 'community_name', 'My SS13 Community');
  await setConfig(mySqlUtils, 'forums_url', 'https://example.com/forums');
  await setConfig(mySqlUtils, 'github_url', 'https://centcom-ss13.github.io/');
  await setConfig(mySqlUtils, 'wiki_url', 'https://example.com/wiki');
  await setConfig(mySqlUtils, 'footer_text', 'CentCom - SS13 Management Platform');
  await setConfig(mySqlUtils, 'panel_header_text', 'My SS13 Community');
  await setConfig(mySqlUtils, 'splash_title_text', 'My SS13 Community');
  await setConfig(mySqlUtils, 'panel_home_intro_text', 'My SS13 Community');
  await setConfig(mySqlUtils, 'twitter_url', 'https://example.com/twitter');
  await setConfig(mySqlUtils, 'steam_url', 'https://example.com/steam');
  await setConfig(mySqlUtils, 'discord_url', 'https://example.com/discord');
  await setConfig(mySqlUtils, 'donate_url', 'https://example.com/donate');
});

exports.down = MigrationUtils.mySqlDown(async function(mySqlUtils) {
  try {
    await mySqlUtils.runSql('DELETE FROM config WHERE 1=1');
  } catch(e) {}
  try {
    await mySqlUtils.runSql('DELETE FROM community_config WHERE 1=1');
  } catch(e) {}
});

exports._meta = {
  "version": 1
};
