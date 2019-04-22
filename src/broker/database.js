import mysql from 'mysql';
import config from 'config';

const buildQuery = (statements = []) => statements.join('\n');

class DB {
  constructor() {
    this.connection = mysql.createConnection({
      host     : config.get('databaseUrl'),
      user     : config.get('databaseUsername'),
      password : config.get('databasePassword'),
      port     : config.get('databasePort'),
      multipleStatements: true,
    });
  }

  query(query, { omitUseDatabase = false } = {}) {
    return new Promise((resolve, reject) => {
      const finalQuery = omitUseDatabase ? query.toString() : `USE centcom;${query.toString()}`;
      console.log(finalQuery);
      this.connection.query(finalQuery, (err, results, fields) => {
        if(err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  multiQuery(statements, options) {
    return this.query(buildQuery(statements), options);
  }

  end() {
    try {
      return new Promise((resolve, reject) => {
        this.connection.end((err) => {
          if(err) {
            reject(err);
          } else {
            resolve('ok');
          }
        });
      });
    } catch(e) { console.log(e) }
  }
}

export { DB };