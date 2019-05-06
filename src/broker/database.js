import mysql from 'mysql';
import config from 'config';
import { promisify, callbackify } from 'util';
import Boom from '@hapi/boom';

const buildQuery = (statements = []) => statements.join('\n');

let instance;

class DB {
  constructor() {
    const user = config.get('databaseUsername') || process.env.centcom_db_user;
    const password = config.get('databasePassword') || process.env.centcom_db_password;

    this.pool = mysql.createPool({
      connectionLimit: 20,
      host: config.get('databaseUrl'),
      user,
      password,
      port: config.get('databasePort'),
      multipleStatements: true,
      database: config.get('databaseDb'),
    });
  }

  async query(query) {
    if (config.get('debug')) {
      console.log(`Executing query: "${query.toString()}"`);
    }
    try {
      if (this.forceConnectionPromise) {
        const connection = await this.forceConnectionPromise;
        return await promisify(connection.query.bind(connection))(query.toString());
      } else {
        return await promisify(this.pool.query.bind(this.pool))(query.toString());
      }
    } catch (error) {
      this.forceConnectionPromise = null; //Free our connection just in case
      throw error;
    }
  }

  async transaction(func) {
    if(!this.forceConnectionPromise) { //This is because all queries while the transaction is active NEED to be from the same connection
      this.forceConnectionPromise = promisify(this.pool.getConnection.bind(this.pool))();
    }

    const connection = await this.forceConnectionPromise;

    await promisify(connection.beginTransaction.bind(connection))();

    try {
      const response = await func();

      await promisify(connection.commit.bind(connection))();

      connection.release(); //Cleanup
      this.forceConnectionPromise = null;

      return response;
    } catch (error) {
      console.log('Error during DB transaction: ', error);

      await promisify(connection.rollback.bind(connection))();

      connection.release();
      this.forceConnectionPromise = null;

      throw Boom.badImplementation("Error during DB Transaction");
    }
  }

  async ping() {
    const connection = await promisify(this.pool.getConnection.bind(this.pool))();
    const ping = await promisify(connection.ping.bind(connection))();
    connection.release();
    return ping;
  }

  multiQuery(statements, options) {
    return this.query(buildQuery(statements), options);
  }

  end() {
    try {
      return new Promise((resolve, reject) => {
        this.pool.end((err) => {
          if (err) {
            reject(err);
          } else {
            resolve('ok');
          }
        });
      });
    } catch (e) {
      console.log(e)
    }
  }
}

function getDB() {
  if (instance) {
    return instance;
  } else {
    instance = new DB();

    return instance;
  }
}

export { getDB };