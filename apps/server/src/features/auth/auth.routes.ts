import { Router } from 'express';
import { registerSchema, loginSchema } from '@livepad/shared';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { register, login, refresh, logout, me } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, me);
