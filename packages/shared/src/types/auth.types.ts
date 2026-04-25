export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
