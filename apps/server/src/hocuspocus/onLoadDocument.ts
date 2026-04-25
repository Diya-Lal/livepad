import type { onLoadDocumentPayload } from '@hocuspocus/server';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

export async function onLoadDocument({ documentName, document }: onLoadDocumentPayload) {
  const doc = await prisma.document.findUnique({
    where: { id: documentName },
    select: { yjsState: true },
  });

  if (doc?.yjsState) {
    const uint8 = new Uint8Array(doc.yjsState);
    const { applyUpdate } = await import('yjs');
    applyUpdate(document, uint8);
    logger.debug({ documentId: documentName }, 'Loaded Yjs state from DB');
  }
}
