import BanService from '../service/bans';

const getBans = {
  method: 'GET',
  path: '/bans',
  handler: async function (request, h) {
    return await BanService.getBans();
  },
};

const editBan = {
  method: 'PUT',
  path: '/bans/{id}',
  handler: async function (request, h) {
    const banInput = {
      ...request.payload,
      id: request.params.id,
    };

    return await BanService.editBan(banInput);
  },
};

const deleteBan = {
  method: 'DELETE',
  path: '/bans/{id}',
  handler: async function (request, h) {
    return await BanService.deleteBan(request.params.id);
  },
};

const createBan = {
  method: 'POST',
  path: '/bans',
  handler: async function (request, h) {
    return await BanService.createBan(request.payload, 1);
  },
};

export default [
  getBans,
  createBan,
  editBan,
  deleteBan,
];