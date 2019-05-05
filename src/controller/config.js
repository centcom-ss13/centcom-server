import ConfigService from '../service/config';

const getConfig = {
  method: 'GET',
  path: '/config',
  handler: async function (request, h) {
    return await ConfigService.getConfig();
  },
  options: {
    auth: false,
  },
};

const editConfig = {
  method: 'PUT',
  path: '/config/{key}',
  handler: async function (request, h) {
    return await ConfigService.editConfig(request.params.key, request.payload);
  },
};

const deleteConfig = {
  method: 'DELETE',
  path: '/config/{key}',
  handler: async function (request, h) {
    return await ConfigService.deleteConfig(request.params.key);
  },
};

const createConfig = {
  method: 'POST',
  path: '/config/{key}',
  handler: async function (request, h) {
    return await ConfigService.createConfig(request.params.key, request.payload);
  },
};

export default [
  getConfig,
  createConfig,
  editConfig,
  deleteConfig,
];