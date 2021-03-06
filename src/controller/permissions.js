import PermissionService from '../service/permissions';

const getPermissions = {
  method: 'GET',
  path: '/permissions',
  handler: async function (request, h) {
    return await PermissionService.getPermissions();
  },
};

const editPermission = {
  method: 'PUT',
  path: '/permissions/{id}',
  handler: async function (request, h) {
    const id = parseInt(request.params.id, 10);

    return await PermissionService.editPermission(id, request.payload);
  },
};

const deletePermission = {
  method: 'DELETE',
  path: '/permissions/{id}',
  handler: async function (request, h) {
    return await PermissionService.deletePermission(request.params.id);
  },
};

const createPermission = {
  method: 'POST',
  path: '/permissions',
  handler: async function (request, h) {
    return await PermissionService.createPermission(request.payload.input, request.payload.sender_id);
  },
};

const userPermissions = {
  method: 'GET',
  path: '/users/{id}/permissions',
  handler: async function (request, h) {
    return await PermissionService.getDerivedUserPermissions(request.params.id);
  },
};

export default [
  getPermissions,
  createPermission,
  editPermission,
  deletePermission,
  userPermissions,
];