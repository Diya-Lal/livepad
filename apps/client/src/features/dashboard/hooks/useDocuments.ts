import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchDocuments, createDocument, updateDocument, deleteDocument } from '../api/documents.api';
import type { DocumentWithPermission } from '@livepad/shared';

const DOCUMENTS_KEY = ['documents'] as const;

export function useDocuments(search: string) {
  const query = useQuery({
    queryKey: DOCUMENTS_KEY,
    queryFn: () => fetchDocuments().then(r => r.data),
  });

  const filtered = useMemo(() => {
    if (!query.data) return [];
    if (!search.trim()) return query.data;
    const lower = search.toLowerCase();
    return query.data.filter(doc => doc.title.toLowerCase().includes(lower));
  }, [query.data, search]);

  return { ...query, documents: filtered };
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createDocument({ title: 'Untitled' }).then(r => r.data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: DOCUMENTS_KEY });
      const previous = queryClient.getQueryData<DocumentWithPermission[]>(DOCUMENTS_KEY);

      const optimistic: DocumentWithPermission = {
        id: `optimistic-${Date.now()}`,
        title: 'Untitled',
        ownerId: '',
        role: 'OWNER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };

      queryClient.setQueryData<DocumentWithPermission[]>(DOCUMENTS_KEY, prev =>
        [optimistic, ...(prev ?? [])]
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DOCUMENTS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateDocument(id, { title }).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: DOCUMENTS_KEY });
      const previous = queryClient.getQueryData<DocumentWithPermission[]>(DOCUMENTS_KEY);
      queryClient.setQueryData<DocumentWithPermission[]>(DOCUMENTS_KEY, prev =>
        prev?.filter(doc => doc.id !== id) ?? []
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DOCUMENTS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY });
    },
  });
}
