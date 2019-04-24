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
      database : config.get('databaseDb'),
    });
  }

  query(query) {
    return new Promise((resolve, reject) => {
      if(config.get('debug')) {
        console.log(`Executing query: "${query.toString()}"`);
      }

      this.connection.query(query.toString(), (err, results, fields) => {
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