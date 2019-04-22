import initTablesSql from '../sql/initTables.sql';
import setConfig from '../sql/setConfig.sql';
import initServers from '../sql/initServers.sql';
import initBooks from '../sql/initBooks.sql';
import initUsers from '../sql/initUsers.sql';
import destroy from '../sql/destroy.sql';

import {DB} from '../broker/database';

const db = new DB();

const initDB = {
  method: 'GET',
  path: '/init',
  handler: async function (request, h) {
    const queries = [
      [initTablesSql],
      [setConfig],
      [initUsers],
      [initServers],
      [initBooks],
    ];

    return await db.multiQuery(queries, { omitUseDatabase: true });
  },
};

const destroyDB = {
  method: 'GET',
  path: '/destroy',
  handler: async function (request, h) {
    const queries = [
      [destroy],
    ];

    return await db.multiQuery(queries, { omitUseDatabase: true });
  },
};

export default [
  initDB,
  destroyDB,
];