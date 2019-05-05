import BanService from '../service/bans';

const getBans = {
  method: 'GET',
  path: '/bans',
  handler: async function (request, h) {
    return await BanService.getBans();
  },
  options: {
    auth: false,
  },
};

const editBan = {
  method: 'PUT',
  path: '/bans/{id}',
  handler: async function (request, h) {
    const id = parseInt(request.params.id, 10);

    return await BanService.editBan(id, request.payload);
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
    return await BanService.createBan(request.payload);
  },
};

export default [
  getBans,
  createBan,
  editBan,
  deleteBan,
];