import CommunityConfigService from '../service/communityConfig';

const getConfig = {
  method: 'GET',
  path: '/communityConfig',
  handler: async function (request, h) {
    return await CommunityConfigService.getConfig();
  },
  options: {
    auth: false,
  },
};

const editConfig = {
  method: 'PUT',
  path: '/communityConfig/{key}',
  handler: async function (request, h) {
    return await CommunityConfigService.editConfig(request.params.key, request.payload);
  },
};

const deleteConfig = {
  method: 'DELETE',
  path: '/communityConfig/{key}',
  handler: async function (request, h) {
    return await CommunityConfigService.deleteConfig(request.params.key);
  },
};

const createConfig = {
  method: 'POST',
  path: '/communityConfig/{key}',
  handler: async function (request, h) {
    return await CommunityConfigService.createConfig(request.params.key, request.payload);
  },
};

export default [
  getConfig,
  createConfig,
  editConfig,
  deleteConfig,
];