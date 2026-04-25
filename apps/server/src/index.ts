import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'Server started');
});

async function shutdown() {
  logger.info('Shutting down...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
