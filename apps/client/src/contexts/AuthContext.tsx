import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@livepad/shared';
import { setAccessToken } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false });

  const setAuth = useCallback((user: User, token: string) => {
    setAccessToken(token);
    setState({ user, isAuthenticated: true });
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setState({ user: null, isAuthenticated: false });
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
