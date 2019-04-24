import BanRepository from "../repository/bans";

async function getBans() {
  return await BanRepository.getBans();
}

async function createBan({
  byond_key,
  reason,
  expiration_date,
  ip,
  computer_id,
  jobs,
}, issuer_id) {
  const ban = await BanRepository.createBan(byond_key, reason, expiration_date, ip, computer_id, issuer_id);

  return ban;
}

async function editBan({
  id,
  byond_key,
  reason,
  expiration_date,
  ip,
  computer_id,
  jobs,
}) {
  return await BanRepository.editBan(id, byond_key, reason, expiration_date, ip, computer_id);
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