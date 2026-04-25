import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing token', statusCode: 401 });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string };
    (req as AuthenticatedRequest).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token', statusCode: 401 });
  }
}
