const { promisify } = require('util');

module.exports = {
  init(db) {
    this.db = db;
    this.createTable = promisify(db.createTable.bind(db));
    this.addIndex = promisify(db.addIndex.bind(db));
    this.runSql = promisify(db.runSql.bind(db));
    this.dropTable = promisify((tableName, callback) => db.dropTable.call(db, tableName, { ifExists: true }, callback));
  },

  getIdField() {
    return {
      type: 'int',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    };
  }
};