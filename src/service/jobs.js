import JobRepository from "../repository/jobs";

async function getJobs() {
  return await JobRepository.getJobs();
}

async function createJob({
  title,
  aggregate = false,
  childJobIds = [],
}) {
  const job = await JobRepository.createJob(title, aggregate);

  return job;
}

async function editJob({
  id,
  title,
  aggregate = false,
  childJobIds = [],
}) {
  return await JobRepository.editJob(id, title, aggregate);
}

async function deleteJob(id) {
  return await JobRepository.deleteJob(id);
}

export default {
  getJobs,
  createJob,
  editJob,
  deleteJob,
}