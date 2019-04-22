import UserService from '../service/users';

const getUser = {
  method: 'GET',
  path: '/users/{id}',
  handler: async function (request, h) {
    return await UserService.getUser(request.params.id);
  },
};

const getUsers = {
  method: 'GET',
  path: '/users',
  handler: async function (request, h) {
    return await UserService.getUsers();
  },
};

const editUser = {
  method: 'PUT',
  path: '/users/{id}',
  handler: async function (request, h) {
    const userInput = {
      ...request.payload,
      id: request.params.id,
    };

    return await UserService.editUser(userInput);
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