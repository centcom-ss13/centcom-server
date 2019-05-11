import CommunityConfigRepository from '../repository/communityConfig';

async function getConfig() {
  const config = await CommunityConfigRepository.getConfig();

  const mappedConfig = config.reduce((acc, { cfg_key, cfg_value }) => ({
    ...acc,
    [cfg_key]: cfg_value,
  }), {});

  return mappedConfig;
}

async function createConfig(cfg_key, cfg_value) {
  return await CommunityConfigRepository.createConfig(cfg_key, cfg_value);
}

async function editConfig(cfg_key, cfg_value) {
  return await CommunityConfigRepository.editConfig(cfg_key, cfg_value);
}

async function deleteConfig(cfg_key) {
  return await CommunityConfigRepository.deleteConfig(cfg_key);
}

export default {
  getConfig,
  createConfig,
  editConfig,
  deleteConfig,
}