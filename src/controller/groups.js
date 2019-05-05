import GroupService from '../service/groups';

const getGroup = {
  method: 'GET',
  path: '/groups/{id}',
  handler: async function (request, h) {
    return await GroupService.getGroup(request.params.id);
  },
  options: {
    auth: false,
  },
};

const getGroups = {
  method: 'GET',
  path: '/groups',
  handler: async function (request, h) {
    return await GroupService.getGroups();
  },
  options: {
    auth: false,
  },
};

const editGroup = {
  method: 'PUT',
  path: '/groups/{id}',
  handler: async function (request, h) {
    const id = parseInt(request.params.id, 10);

    return await GroupService.editGroup(id, request.payload);
  },
};

const deleteGroup = {
  method: 'DELETE',
  path: '/groups/{id}',
  handler: async function (request, h) {
    return await GroupService.deleteGroup(request.params.id);
  },
};

const createGroup = {
  method: 'POST',
  path: '/groups',
  handler: async function (request, h) {
    return await GroupService.createGroup(request.payload);
  },
};

const groupsForUser = {
  method: 'GET',
  path: '/users/{id}/groups',
  handler: async function (request, h) {
    return await GroupService.getGroupsForUser(request.params.id);
  },
};

export default [
  getGroup,
  getGroups,
  editGroup,
  deleteGroup,
  createGroup,
  groupsForUser,
];