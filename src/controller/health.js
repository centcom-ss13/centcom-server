import { getHealthReporter } from '../util/healthReporter';

const getHealth = {
  method: 'GET',
  path: '/health',
  handler: async function () {
    const healthReporter = await getHealthReporter();

    return healthReporter.getHealth();
  },
  options: {
    auth: false,
  },
};

export default [
  getHealth,
];