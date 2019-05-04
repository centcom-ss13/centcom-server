import DonationLevelService from '../service/donationLevels';

const getDonationLevels = {
  method: 'GET',
  path: '/donationLevels',
  handler: async function (request, h) {
    return await DonationLevelService.getDonationLevels();
  },
};

const editDonationLevel = {
  method: 'PUT',
  path: '/donationLevels/{id}',
  handler: async function (request, h) {
    const id = parseInt(request.params.id, 10);

    return await DonationLevelService.editDonationLevel(id, request.payload);
  },
};

const deleteDonationLevel = {
  method: 'DELETE',
  path: '/donationLevels/{id}',
  handler: async function (request, h) {
    return await DonationLevelService.deleteDonationLevel(request.params.id);
  },
};

const createDonationLevel = {
  method: 'POST',
  path: '/donationLevels',
  handler: async function (request, h) {
    return await DonationLevelService.createDonationLevel(request.payload);
  },
};

export default [
  getDonationLevels,
  createDonationLevel,
  editDonationLevel,
  deleteDonationLevel,
];