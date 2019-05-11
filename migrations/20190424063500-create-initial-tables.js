'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const MigrationUtils = require('./util/migrationUtils');

exports.up = MigrationUtils.mySqlUp(async function (mySqlUtils) {
  const id = mySqlUtils.getIdField();
  await mySqlUtils.createTable(
    'server',
    {
      id,
      name: {
        type: 'string',
        length: 100,
        notNull: true,
        unique: true,
      },
      url: {
        type: 'string',
        length: 500,
      },
      port: 'int',
      //TODO: Add access groups back with another table
    },
  );

  await mySqlUtils.createTable(
    'community_config',
    {
      id,
      cfg_key: {
        type: 'string',
        length: 200,
        notNull: true,
        unique: true,
      },
      cfg_value: {
        type: 'string',
        length: 500,
      },
    }
  );

  await mySqlUtils.createTable(
    'book_category',
    {
      id,
      name: {
        type: 'string',
        length: 100,
        notNull: true,
        unique: true,
      },
      color: {
        type: 'char',
        length: '6',
      },
    },
  );

  await mySqlUtils.createTable(
    'book',
    {
      id,
      title: {
        type: 'string',
        length: 200,
        notNull: true,
        unique: true,
      },
      content: {
        type: 'text',
        notNull: true,
      },
      category_id: {
        type: 'int',
        foreignKey: {
          name: 'book_book_category_id_fk',
          table: 'book_category',
          rules: {
            onDelete: 'SET NULL',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      }
    }
  );

  await mySqlUtils.createTable(
    'permission',
    {
      id,
      name: {
        type: 'string',
        length: 100,
        notNull: true,
        unique: true,
      },
      description: {
        type: 'string',
        length: 400,
      }
    }
  );

  await mySqlUtils.createTable(
    'user',
    {
      id,
      username: {
        type: 'string',
        length: 200,
        notNull: true,
        unique: true,
      },
      password: {
        type: 'string', //bcrypt encryption
        length: 200,
        notNull: true,
      },
      email: {
        type: 'string',
        length: 100,
        unique: true,
      },
      byond_key: {
        type: 'string',
        length: 100,
        unique: true,
      }
    }
  );

  await mySqlUtils.createTable(
    'user_permission',
    {
      id,
      permission: {
        type: 'string', //Acceptable values are keys of the permissions repository
        notNull: true,
        length: 200,
      },
      user_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'user_permission_user_id_fk',
          table: 'user',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      },
    }
  );

  await mySqlUtils.createTable(
    'user_group',
    {
      id,
      name: {
        type: 'string',
        length: 100,
        notNull: true,
        unique: true,
      },
      description: {
        type: 'string',
        length: 200,
      },
    }
  );

  await mySqlUtils.createTable(
    'user_group_member',
    {
      id,
      user_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'user_group_member_user_id_fk',
          table: 'user',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      },
      group_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'user_group_member_user_group_id_fk',
          table: 'user_group',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      },
    }
  );

  await mySqlUtils.createTable(
    'user_group_permission',
    {
      id,
      permission: {
        type: 'string', //Acceptable values are keys of the permissions repository
        notNull: true,
        length: 200,
      },
      group_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'user_group_permission_user_group_id_fk',
          table: 'user_group',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      },
    }
  );

  await mySqlUtils.createTable(
    'job',
    {
      id,
      title: {
        type: 'string',
        length: 100,
        notNull: true,
        unique: true,
      },
      aggregate: {
        type: 'boolean',
        defaultValue: false,
        notNull: true,
      },
      antag: {
        type: 'boolean',
        defaultValue: false,
        notNull: true,
      }
    },
  );

  await mySqlUtils.createTable(
    'ban',
    {
      id,
      byond_key: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      reason: {
        type: 'string',
        length: 1000,
        notNull: true,
      },
      expiration_date: {
        type: 'datetime',
      },
      active: {
        type: 'boolean',
        defaultValue: true,
        notNull: true,
      },
      ip: {
        type: 'string',
        length: 15,
      },
      computer_id: {
        type: 'string',
        length: 100,
      },
      issuer_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'bans_issuer_id_fk',
          table: 'user',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      }
    }
  );

  await mySqlUtils.createTable(
    'job_ban',
    {
      id,
      job_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'job_bans_job_id_fk',
          table: 'job',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      },
      ban_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'job_bans_ban_id_fk',
          table: 'ban',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      }
    }
  );

  await mySqlUtils.createTable(
    'theme_setting',
    {
      id,
      theme_name: {
        type: 'string',
        length: 100,
        notNull: true,
        unique: true,
      },
      description: {
        type: 'string',
        length: 500,
      },
      default_value: {
        type: 'string',
        length: 2000,
      },
    },
  );

  await mySqlUtils.createTable(
    'user_theme_setting',
    {
      id,
      user_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'user_theme_setting_user_id_fk',
          table: 'user',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      },
      theme_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'user_theme_setting_theme_setting_id_fk',
          table: 'theme_setting',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
      },
      theme_value: {
        type: 'string',
        length: 2000,
        notNull: true,
      },
    }
  );

  const addIndexes = await Promise.all([
    mySqlUtils.addIndex('user_permission', 'user_permission_index', ['user_id', 'permission'], true),
    mySqlUtils.addIndex('user_group_member', 'user_group_member_index', ['user_id', 'group_id'], true),
    mySqlUtils.addIndex('user_group_permission', 'user_group_permission_index', ['group_id', 'permission'], true),
    mySqlUtils.addIndex('job_ban', 'job_ban_index', ['ban_id', 'job_id'], true),
    mySqlUtils.addIndex('user_theme_setting', 'user_theme_setting_index', ['user_id', 'theme_id'], true),
  ]);
});

exports.down = MigrationUtils.mySqlDown(async function (mySqlUtils) {
  await mySqlUtils.dropTable('user_theme_setting');
  await mySqlUtils.dropTable('job_ban');
  await mySqlUtils.dropTable('user_group_permission');
  await mySqlUtils.dropTable('user_group_member');
  await mySqlUtils.dropTable('user_permission');
  await mySqlUtils.dropTable('book');
  await mySqlUtils.dropTable('book_category');
  try {
    await mySqlUtils.dropTable('config');
  } catch(e) {}
  try {
    await mySqlUtils.dropTable('community_config');
  } catch(e) {}
  await mySqlUtils.dropTable('server');
  await mySqlUtils.dropTable('job');
  await mySqlUtils.dropTable('user_group');
  await mySqlUtils.dropTable('ban');
  await mySqlUtils.dropTable('user');
  await mySqlUtils.dropTable('permission');
  await mySqlUtils.dropTable('theme_setting');
});

exports._meta = {
  "version": 1
};
