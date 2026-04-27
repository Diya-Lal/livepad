import { apiRequest } from '@/lib/api-client';
import type { Permission, InviteInput, UpdatePermissionInput } from '@livepad/shared';

export async function fetchPermissions(documentId: string): Promise<{ data: Permission[] }> {
  return apiRequest(`/api/documents/${documentId}/permissions`);
}

export async function inviteUser(documentId: string, input: InviteInput): Promise<{ data: Permission }> {
  return apiRequest(`/api/documents/${documentId}/permissions`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updatePermission(
  documentId: string,
  permissionId: string,
  input: UpdatePermissionInput
): Promise<{ data: Permission }> {
  return apiRequest(`/api/documents/${documentId}/permissions/${permissionId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function revokePermission(documentId: string, permissionId: string): Promise<void> {
  return apiRequest(`/api/documents/${documentId}/permissions/${permissionId}`, { method: 'DELETE' });
}
