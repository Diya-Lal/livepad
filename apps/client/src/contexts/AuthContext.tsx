import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '@livepad/shared';
import { setAccessToken } from '@/lib/api-client';
import { refreshToken, getMe } from '@/features/auth/api/auth.api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

interface AuthContextValue extends AuthState {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false, isInitializing: true });

  const setAuth = useCallback((user: User, token: string) => {
    setAccessToken(token);
    setState({ user, isAuthenticated: true, isInitializing: false });
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setState({ user: null, isAuthenticated: false, isInitializing: false });
  }, []);

  useEffect(() => {
    refreshToken()
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        return getMe();
      })
      .then(({ data }) => {
        setState({ user: data.user, isAuthenticated: true, isInitializing: false });
      })
      .catch(() => {
        setState({ user: null, isAuthenticated: false, isInitializing: false });
      });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
