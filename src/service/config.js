import ConfigRepository from '../repository/config';

async function getConfig() {
  const config = await ConfigRepository.getConfig();

  const mappedConfig = config.reduce((acc, { cfg_key, cfg_value }) => ({
    ...acc,
    [cfg_key]: cfg_value,
  }), {});

  return mappedConfig;
}

async function createConfig({ cfg_key, cfg_value }) {
  return await ConfigRepository.createConfig(cfg_key, cfg_value);
}

async function editConfig({ id, cfg_key, cfg_value }) {
  return await ConfigRepository.editConfig(id, cfg_key, cfg_value);
}

async function deleteConfig(id) {
  return await ConfigRepository.deleteConfig(id);
}

export default {
  getConfig,
  createConfig,
  editConfig,
  deleteConfig,
}