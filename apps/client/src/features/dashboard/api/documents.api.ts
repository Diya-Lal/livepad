import { apiRequest } from '@/lib/api-client';
import type { DocumentWithPermission } from '@livepad/shared';
import type { CreateDocumentInput, UpdateDocumentInput } from '@livepad/shared';

export async function fetchDocuments(): Promise<{ data: DocumentWithPermission[] }> {
  return apiRequest('/api/documents');
}

export async function createDocument(input: CreateDocumentInput): Promise<{ data: DocumentWithPermission }> {
  return apiRequest('/api/documents', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateDocument(id: string, input: UpdateDocumentInput): Promise<{ data: DocumentWithPermission }> {
  return apiRequest(`/api/documents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteDocument(id: string): Promise<void> {
  return apiRequest(`/api/documents/${id}`, { method: 'DELETE' });
}
