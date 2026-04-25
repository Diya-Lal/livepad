import type { Request, Response, NextFunction } from 'express';
import { permissionsService } from './permissions.service.js';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export async function listPermissions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const permissions = await permissionsService.list(req.params.documentId, userId);
    res.json({ data: permissions });
  } catch (err) { next(err); }
}

export async function inviteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const permission = await permissionsService.invite(req.params.documentId, userId, req.body);
    res.status(201).json({ data: permission });
  } catch (err) { next(err); }
}

export async function updatePermission(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const permission = await permissionsService.update(req.params.permissionId, userId, req.body);
    res.json({ data: permission });
  } catch (err) { next(err); }
}

export async function revokePermission(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    await permissionsService.revoke(req.params.permissionId, userId);
    res.status(204).send();
  } catch (err) { next(err); }
}
