import type { onAuthenticatePayload } from '@hocuspocus/server';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

export async function onAuthenticate({ token, documentName }: onAuthenticatePayload) {
  let userId: string;

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string };
    userId = payload.sub;
  } catch {
    throw new Error('Unauthorized');
  }

  const doc = await prisma.document.findUnique({ where: { id: documentName } });
  if (!doc || doc.deletedAt) throw new Error('Document not found');

  if (doc.ownerId === userId) return { userId };

  const perm = await prisma.permission.findUnique({
    where: { userId_documentId: { userId, documentId: documentName } },
  });

  if (!perm) {
    logger.warn({ userId, documentId: documentName }, 'Unauthorized collab connection');
    throw new Error('Forbidden');
  }

  return { userId };
}
