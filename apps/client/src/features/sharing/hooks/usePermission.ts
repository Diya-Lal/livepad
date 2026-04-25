import { useReducer, useEffect } from 'react';
import { fetchPermissions, inviteUser, updatePermission, revokePermission } from '../api/permissions.api';
import type { Permission, InviteInput, Role } from '@livepad/shared';

type PermissionState = {
  status: 'idle' | 'loading' | 'updating' | 'error';
  permissions: Permission[];
  error: string | null;
};

type PermissionAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; permissions: Permission[] }
  | { type: 'ADD_OPTIMISTIC'; permission: Permission }
  | { type: 'UPDATE_ROLE'; permissionId: string; role: Role }
  | { type: 'REVOKE'; permissionId: string }
  | { type: 'ERROR'; error: string };

function reducer(state: PermissionState, action: PermissionAction): PermissionState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { status: 'idle', permissions: action.permissions, error: null };
    case 'ADD_OPTIMISTIC':
      return { ...state, permissions: [...state.permissions, action.permission] };
    case 'UPDATE_ROLE':
      return {
        ...state,
        permissions: state.permissions.map(p =>
          p.id === action.permissionId ? { ...p, role: action.role } : p
        ),
      };
    case 'REVOKE':
      return {
        ...state,
        permissions: state.permissions.filter(p => p.id !== action.permissionId),
      };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
    default:
      return state;
  }
}

export function usePermission(documentId: string) {
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle',
    permissions: [],
    error: null,
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    fetchPermissions(documentId)
      .then(r => dispatch({ type: 'FETCH_SUCCESS', permissions: r.data }))
      .catch(err => dispatch({ type: 'ERROR', error: err.message }));
  }, [documentId]);

  const invite = async (input: InviteInput) => {
    const optimistic: Permission = {
      id: `optimistic-${Date.now()}`,
      userId: '',
      documentId,
      role: input.role,
      user: { id: '', name: input.email, email: input.email, avatarUrl: null },
    };
    dispatch({ type: 'ADD_OPTIMISTIC', permission: optimistic });
    try {
      const { data } = await inviteUser(documentId, input);
      dispatch({ type: 'FETCH_SUCCESS', permissions: [...state.permissions.filter(p => !p.id.startsWith('optimistic')), data] });
    } catch (err) {
      dispatch({ type: 'ERROR', error: (err as Error).message });
    }
  };

  const changeRole = async (permissionId: string, role: Role) => {
    dispatch({ type: 'UPDATE_ROLE', permissionId, role });
    try {
      await updatePermission(documentId, permissionId, { role });
    } catch (err) {
      dispatch({ type: 'ERROR', error: (err as Error).message });
    }
  };

  const revoke = async (permissionId: string) => {
    dispatch({ type: 'REVOKE', permissionId });
    try {
      await revokePermission(documentId, permissionId);
    } catch (err) {
      dispatch({ type: 'ERROR', error: (err as Error).message });
    }
  };

  return { ...state, invite, changeRole, revoke };
}
