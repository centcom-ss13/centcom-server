import ThemeSettingRepository from "../repository/themeSettings";
import UserThemeSettingRepository from "../repository/userThemeSettings";

async function getThemeSettings() {
  return await ThemeSettingRepository.getThemeSettings();
}

async function createThemeSetting({
  title,
  aggregate = false,
  childThemeIds = [],
}) {
  const theme = await ThemeSettingRepository.createThemeSetting(title, aggregate);

  return theme;
}

async function editThemeSetting({
  id,
  title,
  aggregate = false,
  childThemeIds = [],
}) {
  return await ThemeSettingRepository.editThemeSetting(id, title, aggregate);
}

async function deleteThemeSetting(id) {
  return await ThemeSettingRepository.deleteThemeSetting(id);
}

async function getUserTheme(id) {
  return await UserThemeSettingRepository.getUserThemes(id);
}

async function setUserTheme(userId, themeId, value) {
  return await UserThemeSettingRepository.setUserTheme(userId, themeId, value);
}

export default {
  getThemeSettings,
  createThemeSetting,
  editThemeSetting,
  deleteThemeSetting,
  getUserTheme,
  setUserTheme,
}