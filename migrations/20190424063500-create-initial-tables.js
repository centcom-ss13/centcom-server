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

const { promisify, callbackify } = require('util');

const id = {
  type: 'int',
  notNull: true,
  primaryKey: true,
  autoIncrement: true,
};

exports.up = callbackify(async function (db) {
  const createTable = promisify(db.createTable.bind(db));
  const addIndex = promisify(db.addIndex.bind(db));

  await createTable(
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

  await createTable(
    'config',
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

  await createTable(
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

  await createTable(
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

  await createTable(
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

  await createTable(
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

  await createTable(
    'user_permission',
    {
      id,
      permission_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'user_permission_permission_id_fk',
          table: 'permission',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        }
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

  await createTable(
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

  await createTable(
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

  await createTable(
    'user_group_permission',
    {
      id,
      permission_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'user_group_permission_permission_id_fk',
          table: 'permission',
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

  await createTable(
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
      }
    },
  );

  await createTable(
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

  await createTable(
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

  await createTable(
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

  await createTable(
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
    addIndex('user_permission', 'user_permission_index', ['user_id', 'permission_id'], true),
    addIndex('user_group_member', 'user_group_member_index', ['user_id', 'group_id'], true),
    addIndex('user_group_permission', 'user_group_permission_index', ['group_id', 'permission_id'], true),
    addIndex('job_ban', 'job_ban_index', ['ban_id', 'job_id'], true),
    addIndex('user_theme_setting', 'user_theme_setting_index', ['user_id', 'theme_id'], true),
  ]);
});

exports.down = callbackify(async function (db) {
  const dropTable = promisify((tableName, callback) => db.dropTable.call(db, tableName, { ifExists: true }, callback));

  await dropTable('user_theme_setting');
  await dropTable('job_ban');
  await dropTable('user_group_permission');
  await dropTable('user_group_member');
  await dropTable('user_permission');
  await dropTable('book');
  await dropTable('book_category');
  await dropTable('config');
  await dropTable('server');
  await dropTable('job');
  await dropTable('user_group');
  await dropTable('ban');
  await dropTable('user');
  await dropTable('permission');
  await dropTable('theme_setting');
});

exports._meta = {
  "version": 1
};
