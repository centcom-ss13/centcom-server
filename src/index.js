import Hapi from 'hapi';
import config from 'config';
import fs from 'fs';
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
    ...(config.get('apiSSL') && { tls: {
      key: fs.readFileSync(config.get('apiSSLKeyFile')),
      cert: fs.readFileSync(config.get('apiSSLCertFile')),
      passphrase: config.get('apiSSLKeyPassphrase'),
    } }),
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