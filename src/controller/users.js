import UserService from '../service/users';
import { stripKeysFromObject } from "../util/queryUtils";

const getUser = {
  method: 'GET',
  path: '/users/{id}',
  handler: async function (request, h) {
    const user = await UserService.getUser(request.params.id);

    const prunedUser = stripKeysFromObject(user, ['password']);

    return prunedUser;
  },
};

const getUsers = {
  method: 'GET',
  path: '/users',
  handler: async function (request, h) {
    const users = await UserService.getUsers();

    const prunedUsers = users.map(user => stripKeysFromObject(user, ['password']));

    return prunedUsers;
  },
};

const editUser = {
  method: 'PUT',
  path: '/users/{id}',
  handler: async function (request, h) {
    const id = parseInt(request.params.id, 10);

    return await UserService.editUser(id, request.payload);
  },
};

const deleteUser = {
  method: 'DELETE',
  path: '/users/{id}',
  handler: async function (request, h) {
    return await UserService.deleteUser(request.params.id);
  },
};

const createUser = {
  method: 'POST',
  path: '/users',
  handler: async function (request, h) {
    return await UserService.createUser(request.payload);
  },
};


export default [
  getUser,
  getUsers,
  editUser,
  deleteUser,
  createUser,
];