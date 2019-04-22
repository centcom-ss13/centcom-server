import ConfigService from '../service/config';

const getConfig = {
  method: 'GET',
  path: '/config',
  handler: async function (request, h) {
    return await ConfigService.getConfig();
  },
};

const editConfig = {
  method: 'PUT',
  path: '/config/{id}',
  handler: async function (request, h) {
    const configInput = {
      ...request.payload,
      id: request.params.id,
    };

    return await ConfigService.editConfig(configInput);
  },
};

const deleteConfig = {
  method: 'DELETE',
  path: '/config/{id}',
  handler: async function (request, h) {
    return await ConfigService.deleteConfig(request.params.id);
  },
};

const createConfig = {
  method: 'POST',
  path: '/config',
  handler: async function (request, h) {
    return await ConfigService.createConfig(request.payload);
  },
};

export default [
  getConfig,
  createConfig,
  editConfig,
  deleteConfig,
];