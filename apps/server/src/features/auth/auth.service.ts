import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import type { RegisterInput, LoginInput } from '@livepad/shared';

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw Object.assign(new Error('Email already in use'), { statusCode: 409 });
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: { email: input.email, name: input.name, passwordHash },
      select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
    });

    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    return { user, accessToken, refreshToken };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true, passwordHash: true },
    });

    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const { passwordHash: _, ...safeUser } = user;
    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    return { user: safeUser, accessToken, refreshToken };
  }

  async refresh(token: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
    }

    await prisma.refreshToken.delete({ where: { token } });
    const { accessToken, refreshToken } = await this.generateTokens(stored.userId);
    return { accessToken, refreshToken };
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  async getUser(userId: string) {
    return prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
    });
  }

  private async generateTokens(userId: string) {
    const accessToken = jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
