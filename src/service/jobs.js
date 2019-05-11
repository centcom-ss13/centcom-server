import JobRepository from "../repository/jobs";
import JobValidator from "../validator/jobs";
import Boom from '@hapi/boom';
import {getDB} from "../broker/database";

const db = getDB();

async function getJobs() {
  const [
    jobs,
    childJobs,
  ] = await Promise.all([
    JobRepository.getJobs(),
    JobRepository.getAllChildJobs(),
  ]);

  const hydratedJobs = jobs.map(job => ({
    ...job,
    childJobIds: childJobs
    .filter(({ parent_job_id }) => job.id === parent_job_id)
    .map(({ child_job_id }) => child_job_id),
  }));

  return hydratedJobs;
}

async function createJob(jobInput) {
  const defaults = {
    aggregate: false,
    childJobIds: [],
  };

  const hydratedJobInput = {
    ...defaults,
    ...jobInput,
  };

  await JobValidator.validateJob(hydratedJobInput);

  const {
    title,
    aggregate,
    childJobIds,
  } = hydratedJobInput;

  return await db.transaction(async () => {
    const job = await JobRepository.createJob({ title, aggregate });

    const childJobAddFutures = childJobIds.map(childJobId => JobRepository.addChildJob(job.id, childJobId));

    return await Promise.all(childJobAddFutures);
  });
}

async function editJob(id, jobInput) {
  const defaults = {
    aggregate: false,
    childJobIds: [],
  };

  const hydratedJobInput = {
    ...defaults,
    ...jobInput,
  };

  await JobValidator.validateJob(hydratedJobInput);

  const {
    title,
    aggregate,
    childJobIds,
  } = hydratedJobInput;

  return await db.transaction(async () => {
    const jobEditFuture = JobRepository.editJob(id, { title, aggregate });

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
  });
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