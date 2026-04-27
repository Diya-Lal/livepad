import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuthContext();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
