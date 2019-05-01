import Boom from '@hapi/boom';
import JobService from '../service/jobs';

const MAX_JOB_TITLE_LENGTH = 100;

async function validateChildJobs({ id, aggregate, childJobIds = [] }) {
  if(!Array.isArray(childJobIds)) {
    throw Boom.badRequest('Child Job Ids must be an array (or omitted)');
  }

  if(!(typeof aggregate === 'boolean' || (typeof aggregate === 'number' && (aggregate === 0 || aggregate === 1)))) {
    throw Boom.badRequest('Field "aggregate" must be of type boolean (or a 0/1 number)')
  }

  if(!aggregate && childJobIds.length > 0) {
    throw Boom.badRequest('Cannot add child jobs to a non-aggregate job definition');
  }

  if(id && childJobIds.includes(id)) { //For creations, we don't have an ID and don't worry about this check
    throw Boom.badRequest('Cannot add a job as its own child');
  }

  if(aggregate) {
    const jobs = await JobService.getJobs();

    const childJobs = childJobIds
    .map(childJobId => jobs.find(({ id }) => id === childJobId));

    const failedAggregateJobTitles = childJobs
    .filter(({ aggregate }) => aggregate)
    .map(({ title }) => title);

    if(failedAggregateJobTitles.length > 0) {
      throw Boom.badRequest(`Cannot add a child aggregate job (invalid job(s): [${failedAggregateJobTitles.join(', ')}])`);
    }

    if(id) { //On edit, confirm no jobs currently contain it as a child if it is an aggregate
      const currentParentJobTitles = jobs
      .filter(({ id: currentJobId }) => currentJobId !== id)
      .filter(({ childJobIds }) => childJobIds.includes(id))
      .map(({ title }) => title);

      if(currentParentJobTitles.length > 0) {
        throw Boom.badRequest(`Cannot edit job to aggregate because other aggregate jobs list it as a child (parent job(s): [${currentParentJobTitles.join(', ')}])`);
      }
    }
  }
}

async function validateJobTitle({ title }) {
  if(!title || typeof title !== 'string') {
    throw Boom.badRequest('Job title must not be empty');
  }

  if(title.length > MAX_JOB_TITLE_LENGTH) {
    throw Boom.badRequest('Job Title cannot be longer than 100 characters');
  }
}

async function validateJob(jobInput) {
  await validateJobTitle(jobInput);
  await validateChildJobs(jobInput);
}

export default { validateJob };