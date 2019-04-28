import Hapi from 'hapi';
import config from 'config';
import * as controllers from './controller';
import { getHealthReporter } from './util/healthReporter';

function registerRoute(server, route) {
  console.log(`Registering Route: ${route.method} ${route.path}`);
  server.route(route);
}

function addControllers(server) {
  Object.values(controllers).forEach(controller => controller.forEach(route => registerRoute(server, route)));
}

async function init() {
  const server = Hapi.server({
    port: config.get('apiPort'),
    host: config.get('apiHost'),
    routes: {
      cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type"],
        additionalHeaders: ["X-Requested-With"],
      },
    },
    ...(config.get('debug') && { debug: { request: ['error'] } }),
  });

  addControllers(server);

  await server.start();

  const healthReporter = await getHealthReporter();
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();