import { createContext, useContext, type ReactNode } from 'react';
import type { Role } from '@livepad/shared';

interface PermissionContextValue {
  role: Role;
  documentId: string;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

export function PermissionProvider({
  children,
  role,
  documentId,
}: { children: ReactNode; role: Role; documentId: string }) {
  return (
    <PermissionContext.Provider value={{ role, documentId }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error('usePermissionContext must be used within PermissionProvider');
  return ctx;
}
