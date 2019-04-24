import * as Boom from '@hapi/boom';

const initDB = {
  method: 'GET',
  path: '/init',
  handler: async function (request, h) {
    return Boom.notImplemented();
  },
};

const destroyDB = {
  method: 'GET',
  path: '/destroy',
  handler: async function (request, h) {
    return Boom.notImplemented();
  },
};

export default [
  initDB,
  destroyDB,
];