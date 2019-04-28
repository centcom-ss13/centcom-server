import * as Boom from '@hapi/boom';

const initDB = {
  method: 'GET',
  path: '/init',
  handler: async function (request, h) {
    throw Boom.notImplemented();
  },
};

const destroyDB = {
  method: 'GET',
  path: '/destroy',
  handler: async function (request, h) {
    throw Boom.notImplemented();
  },
};

export default [
  initDB,
  destroyDB,
];