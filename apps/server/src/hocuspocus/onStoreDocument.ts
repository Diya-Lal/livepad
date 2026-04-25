import type { onStoreDocumentPayload } from '@hocuspocus/server';
import { encodeStateAsUpdate } from 'yjs';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

export async function onStoreDocument({ documentName, document }: onStoreDocumentPayload) {
  const state = Buffer.from(encodeStateAsUpdate(document));

  await prisma.document.update({
    where: { id: documentName },
    data: { yjsState: state, updatedAt: new Date() },
  });

  logger.debug({ documentId: documentName }, 'Stored Yjs state to DB');
}
