import { prisma } from '../../lib/prisma.js';
import type { CreateDocumentInput, UpdateDocumentInput } from '@livepad/shared';

export class DocumentsService {
  async listForUser(userId: string) {
    const permissions = await prisma.permission.findMany({
      where: { userId, document: { deletedAt: null } },
      include: {
        document: {
          select: { id: true, title: true, ownerId: true, createdAt: true, updatedAt: true, deletedAt: true },
        },
      },
      orderBy: { document: { updatedAt: 'desc' } },
    });

    const owned = await prisma.document.findMany({
      where: { ownerId: userId, deletedAt: null },
      select: { id: true, title: true, ownerId: true, createdAt: true, updatedAt: true, deletedAt: true },
      orderBy: { updatedAt: 'desc' },
    });

    type Permission = typeof permissions[number];
    type OwnedDoc = typeof owned[number];

    const sharedIds = new Set(permissions.map((p: Permission) => p.documentId));
    const ownedNotShared = owned.filter((d: OwnedDoc) => !sharedIds.has(d.id));

    const all = [
      ...ownedNotShared.map((d: OwnedDoc) => ({ ...d, role: 'OWNER' as const })),
      ...permissions.map((p: Permission) => ({ ...p.document, role: p.role })),
    ];

    all.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return all;
  }

  async create(userId: string, input: CreateDocumentInput) {
    return prisma.document.create({
      data: {
        title: input.title ?? 'Untitled',
        ownerId: userId,
      },
      select: { id: true, title: true, ownerId: true, createdAt: true, updatedAt: true, deletedAt: true },
    });
  }

  async update(documentId: string, userId: string, input: UpdateDocumentInput) {
    await this.assertOwnerOrEditor(documentId, userId);
    return prisma.document.update({
      where: { id: documentId },
      data: { title: input.title },
      select: { id: true, title: true, ownerId: true, createdAt: true, updatedAt: true, deletedAt: true },
    });
  }

  async softDelete(documentId: string, userId: string) {
    await this.assertOwner(documentId, userId);
    await prisma.document.update({
      where: { id: documentId },
      data: { deletedAt: new Date() },
    });
  }

  private async assertOwnerOrEditor(documentId: string, userId: string) {
    const doc = await prisma.document.findUniqueOrThrow({ where: { id: documentId } });
    if (doc.ownerId === userId) return;

    const perm = await prisma.permission.findUnique({ where: { userId_documentId: { userId, documentId } } });
    if (!perm || perm.role !== 'EDITOR') {
      throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
    }
  }

  private async assertOwner(documentId: string, userId: string) {
    const doc = await prisma.document.findUniqueOrThrow({ where: { id: documentId } });
    if (doc.ownerId !== userId) {
      throw Object.assign(new Error('Only the owner can delete this document'), { statusCode: 403 });
    }
  }
}

export const documentsService = new DocumentsService();
