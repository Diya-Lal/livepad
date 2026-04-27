import { useEffect, useRef } from 'react';
import { usePermission } from '../hooks/usePermission';
import { InviteForm } from './InviteForm';
import { PermissionSelect } from './PermissionSelect';
import type { Role } from '@livepad/shared';

interface Props {
  documentId: string;
  onClose: () => void;
}

export function ShareModal({ documentId, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { permissions, status, invite, changeRole, revoke } = usePermission(documentId);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Share document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <InviteForm onInvite={invite} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            People with access
          </p>
          {status === 'loading' && (
            <p className="text-sm text-gray-400">Loading...</p>
          )}
          {permissions.map(perm => (
            <div key={perm.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{perm.user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{perm.user.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <PermissionSelect
                  value={perm.role as Exclude<Role, 'OWNER'>}
                  onChange={role => changeRole(perm.id, role)}
                />
                <button
                  onClick={() => revoke(perm.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
