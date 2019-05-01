import BanRepository from "../repository/bans";
import { validateBan } from '../validator/bans';
async function getBans() {
  return await BanRepository.getBans();
}

async function createBan(input, banInput, sender_id) {
  const defaults = {
    isJobBan: false,
    isPermanentBan: false,
    active: false,
  };

  const hydratedBanInput = {
    ...defaults,
    ...banInput,
  };

  validateBan(hydratedBanInput, sender_id);

  const databaseObject = {
    ...hydratedBanInput,
    sender_id,
  };

  return await BanRepository.createBan(databaseObject);
}

async function editBan(id, banInput, sender_id) {
  const defaults = {
    isJobBan: false,
    isPermanentBan: false,
    active: false,
  };

  const hydratedBanInput = {
    ...defaults,
    ...banInput,
  };

  validateBan(hydratedBanInput, sender_id);

  const databaseObject = {
    ...hydratedBanInput,
    sender_id,
  };

  return await BanRepository.editBan(id, databaseObject);
}

async function deleteBan(id) {
  return await BanRepository.deleteBan(id);
}

export default {
  getBans,
  createBan,
  editBan,
  deleteBan,
}