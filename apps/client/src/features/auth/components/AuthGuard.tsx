import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
