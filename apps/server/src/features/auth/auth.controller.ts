import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(201).json({ data: { user, accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.json({ data: { user, accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized', message: 'No refresh token', statusCode: 401 });
      return;
    }
    const { accessToken, refreshToken } = await authService.refresh(token);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.json({ data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (token) await authService.logout(token);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getUser((req as AuthenticatedRequest).userId);
    res.json({ data: { user } });
  } catch (err) {
    next(err);
  }
}
