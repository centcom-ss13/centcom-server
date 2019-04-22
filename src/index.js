import Hapi from 'hapi';
import config from 'config';
import * as controllers from './controller';

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
  });

  addControllers(server);

  await server.start();
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();