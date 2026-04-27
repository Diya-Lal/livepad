import type { Request, Response, NextFunction } from 'express';
import { documentsService } from './documents.service.js';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export async function listDocuments(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const documents = await documentsService.listForUser(userId);
    res.json({ data: documents });
  } catch (err) {
    next(err);
  }
}

export async function createDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const document = await documentsService.create(userId, req.body);
    res.status(201).json({ data: document });
  } catch (err) {
    next(err);
  }
}

export async function updateDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const document = await documentsService.update(req.params.id, userId, req.body);
    res.json({ data: document });
  } catch (err) {
    next(err);
  }
}

export async function deleteDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    await documentsService.softDelete(req.params.id, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
