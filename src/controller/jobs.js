import JobService from '../service/jobs';

const getJobs = {
  method: 'GET',
  path: '/jobs',
  handler: async function (request, h) {
    return await JobService.getJobs();
  },
};

const editJob = {
  method: 'PUT',
  path: '/jobs/{id}',
  handler: async function (request, h) {
    const jobInput = {
      ...request.payload,
      id: parseInt(request.params.id, 10),
    };

    return await JobService.editJob(jobInput);
  },
};

const deleteJob = {
  method: 'DELETE',
  path: '/jobs/{id}',
  handler: async function (request, h) {
    return await JobService.deleteJob(request.params.id);
  },
};

const createJob = {
  method: 'POST',
  path: '/jobs',
  handler: async function (request, h) {
    return await JobService.createJob(request.payload);
  },
};

export default [
  getJobs,
  createJob,
  editJob,
  deleteJob,
];