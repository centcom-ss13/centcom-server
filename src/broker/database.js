import mysql from 'mysql';
import config from 'config';

const buildQuery = (statements = []) => statements.join('\n');

class DB {
  constructor() {
    const user = config.get('databaseUsername') || process.env.centcom_db_user;
    const password = config.get('databasePassword') || process.env.centcom_db_password;

    this.connection = mysql.createPool({
      connectionLimit : 20,
      host     : config.get('databaseUrl'),
      user,
      password,
      port     : config.get('databasePort'),
      multipleStatements: true,
    });
  }

  query(query, { omitUseDatabase = false } = {}) {
    return new Promise((resolve, reject) => {
      const finalQuery = omitUseDatabase ? query.toString() : `USE centcom;${query.toString()}`;
      if(config.get('debug')) {
        console.log(`Executing query: "${finalQuery}"`);
      }

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