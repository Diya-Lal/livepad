import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { hocuspocusServer } from './hocuspocus/server.js';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'HTTP server started');
});

hocuspocusServer.listen(env.COLLAB_PORT, () => {
  logger.info({ port: env.COLLAB_PORT }, 'Hocuspocus server started');
});

async function shutdown() {
  logger.info('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
