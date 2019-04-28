import JobRepository from "../repository/jobs";
import Boom from '@hapi/boom';

async function getJobs() {
  const jobs = await JobRepository.getJobs();

  const hydratedJobs = await Promise.all(jobs.map(async job => ({
    ...job,
    childJobIds: (await JobRepository.getChildJobs(job.id))
    .map(({ child_job_id }) => child_job_id),
  })));

  return hydratedJobs;
}

async function createJob({
  title,
  aggregate = false,
  childJobIds = [],
}) {
  if(!aggregate && childJobIds.length > 0) {
    throw Boom.badRequest('Cannot add child job IDs to a non-aggregate job.');
  }

  const job = await JobRepository.createJob(title, aggregate);

  console.log('created job', job);

  const childJobAddFutures = childJobIds.map(childJobId => JobRepository.addChildJob(job.id, childJobId));

  return await Promise.all(childJobAddFutures);
}

async function editJob({
  id,
  title,
  aggregate = false,
  childJobIds = [],
}) {
  if(!aggregate && childJobIds.length > 0) {
    throw Boom.badRequest('Cannot add child job IDs to a non-aggregate job.');
  }

  const jobEditFuture = JobRepository.editJob(id, title, aggregate);

  const currentChildJobs = await JobRepository.getChildJobs(id);
  const currentChildJobIds = currentChildJobs.map(({ child_job_id }) => child_job_id);

  const newChildJobs = childJobIds.filter(jobId => !currentChildJobIds.includes(jobId));
  const removedChildJobs = currentChildJobIds.filter(jobId => !childJobIds.includes(jobId));

  const childJobAddFutures = newChildJobs.map(childJobId => JobRepository.addChildJob(id, childJobId));
  const childJobRemoveFutures = removedChildJobs.map(childJobId => JobRepository.removeChildJob(id, childJobId));

  const results = Promise.all([
    jobEditFuture,
    ...childJobAddFutures,
    ...childJobRemoveFutures,
  ]);

  return await results;
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