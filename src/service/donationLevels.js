import DonationLevelRepository from '../repository/donationLevels';

async function getDonationLevels() {
  return await DonationLevelRepository.getDonationLevels();
}

async function createDonationLevel(input) {
  return await DonationLevelRepository.createDonationLevel(input);
}

async function editDonationLevel(id, input) {
  return await DonationLevelRepository.editDonationLevel(id, input);
}

async function deleteDonationLevel(id) {
  return await DonationLevelRepository.deleteDonationLevel(id);
}

export default {
  getDonationLevels,
  createDonationLevel,
  editDonationLevel,
  deleteDonationLevel,
}