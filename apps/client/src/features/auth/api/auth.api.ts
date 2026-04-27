import { apiRequest } from '@/lib/api-client';
import type { RegisterInput, LoginInput, AuthResponse, User } from '@livepad/shared';

export async function registerUser(input: RegisterInput): Promise<{ data: AuthResponse }> {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
    skipAuth: true,
  });
}

export async function loginUser(input: LoginInput): Promise<{ data: AuthResponse }> {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
    skipAuth: true,
  });
}

export async function logoutUser(): Promise<void> {
  return apiRequest('/api/auth/logout', { method: 'POST' });
}

export async function refreshToken(): Promise<{ data: { accessToken: string } }> {
  return apiRequest('/api/auth/refresh', { method: 'POST', skipAuth: true });
}

export async function getMe(): Promise<{ data: { user: User } }> {
  return apiRequest('/api/auth/me');
}
