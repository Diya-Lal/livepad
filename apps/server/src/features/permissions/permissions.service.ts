import { prisma } from '../../lib/prisma.js';
import type { InviteInput, UpdatePermissionInput } from '@livepad/shared';

export class PermissionsService {
  async list(documentId: string, requesterId: string) {
    await this.assertAccess(documentId, requesterId);
    return prisma.permission.findMany({
      where: { documentId },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });
  }

  async invite(documentId: string, requesterId: string, input: InviteInput) {
    await this.assertOwner(documentId, requesterId);

    const target = await prisma.user.findUnique({ where: { email: input.email } });
    if (!target) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    const doc = await prisma.document.findUniqueOrThrow({ where: { id: documentId } });
    if (doc.ownerId === target.id) {
      throw Object.assign(new Error('Cannot change owner permissions'), { statusCode: 400 });
    }

    return prisma.permission.upsert({
      where: { userId_documentId: { userId: target.id, documentId } },
      create: { userId: target.id, documentId, role: input.role },
      update: { role: input.role },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });
  }

  async update(permissionId: string, requesterId: string, input: UpdatePermissionInput) {
    const perm = await prisma.permission.findUniqueOrThrow({ where: { id: permissionId } });
    await this.assertOwner(perm.documentId, requesterId);

    return prisma.permission.update({
      where: { id: permissionId },
      data: { role: input.role },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });
  }

  async revoke(permissionId: string, requesterId: string) {
    const perm = await prisma.permission.findUniqueOrThrow({ where: { id: permissionId } });
    await this.assertOwner(perm.documentId, requesterId);
    await prisma.permission.delete({ where: { id: permissionId } });
  }

  private async assertOwner(documentId: string, userId: string) {
    const doc = await prisma.document.findUniqueOrThrow({ where: { id: documentId } });
    if (doc.ownerId !== userId) {
      throw Object.assign(new Error('Only the owner can manage permissions'), { statusCode: 403 });
    }
  }

  private async assertAccess(documentId: string, userId: string) {
    const doc = await prisma.document.findUniqueOrThrow({ where: { id: documentId } });
    if (doc.ownerId === userId) return;
    const perm = await prisma.permission.findUnique({
      where: { userId_documentId: { userId, documentId } },
    });
    if (!perm) throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  }
}

export const permissionsService = new PermissionsService();
