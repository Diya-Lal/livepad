import { Server } from '@hocuspocus/server';
import { onAuthenticate } from './onAuthenticate.js';
import { onLoadDocument } from './onLoadDocument.js';
import { onStoreDocument } from './onStoreDocument.js';
import { logger } from '../lib/logger.js';

export const hocuspocusServer = Server.configure({
  name: 'livepad-collab',
  debounce: 2000,
  maxDebounce: 10000,
  onAuthenticate,
  onLoadDocument,
  onStoreDocument,
  onConnect: async () => {
    logger.debug('Hocuspocus client connected');
  },
  onDisconnect: async () => {
    logger.debug('Hocuspocus client disconnected');
  },
});
