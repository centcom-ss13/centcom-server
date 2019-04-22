import Hapi from 'hapi';
import * as controllers from './controller';

async function init () {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  Object.values(controllers).forEach(controller => controller.forEach(route => registerRoute(server, route)));

  await server.start();
}

function registerRoute(server, route) {
  console.log('registering route', route);
  server.route(route);
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();