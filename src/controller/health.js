import { getHealthReporter } from '../util/healthReporter';

const getGroups = {
  method: 'GET',
  path: '/health',
  handler: async function () {
    const healthReporter = await getHealthReporter();

    return healthReporter.getHealth();
  },
};

export default [
  getGroups,
];