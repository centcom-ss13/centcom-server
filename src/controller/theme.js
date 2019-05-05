import ThemeService from '../service/theme';

const getTheme = {
  method: 'GET',
  path: '/theme',
  handler: async function (request, h) {
    return await ThemeService.getTheme();
  },
  options: {
    auth: false,
  },
};

const editTheme = {
  method: 'PUT',
  path: '/theme/{id}',
  handler: async function (request, h) {
    const id = parseInt(request.params.id, 10);

    return await ThemeService.editTheme(id, request.payload);
  },
};

const deleteTheme = {
  method: 'DELETE',
  path: '/theme/{id}',
  handler: async function (request, h) {
    return await ThemeService.deleteTheme(request.params.id);
  },
};

const createTheme = {
  method: 'POST',
  path: '/theme',
  handler: async function (request, h) {
    return await ThemeService.createTheme(request.payload);
  },
};

const getUserThemes = {
  method: 'GET',
  path: '/users/:userId/theme',
  handler: async function (request, h) {
    return await ThemeService.getUserTheme(request.params.id);
  },
  options: {
    auth: false,
  },
};

const setUserTheme = {
  method: 'PUT',
  path: '/users/:userId/theme/:themeId',
  handler: async function (request, h) {
    return await ThemeService.setUserTheme(
      request.params.userId,
      request.params.themeId,
      request.payload
    );
  },
};

export default [
  getTheme,
  createTheme,
  editTheme,
  deleteTheme,
  getUserThemes,
  setUserTheme,
];