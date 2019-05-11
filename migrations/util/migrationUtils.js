const MySqlUtils = require('./mySqlUtils');

module.exports = {
  mySqlUp(func) {
    return (db) => {
      MySqlUtils.init(db);
      return func(MySqlUtils);
    }
  },

  mySqlDown(func) {
    return (db) => {
      MySqlUtils.init(db);
      return func(MySqlUtils);
    }
  },
};