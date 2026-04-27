import { lazy, Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { EditorSkeleton } from '@/components/skeletons/EditorSkeleton';
import { apiRequest } from '@/lib/api-client';
import { canEdit } from '@livepad/shared';
import type { DocumentWithPermission } from '@livepad/shared';
import { useCollabEditor } from '../hooks/useCollabEditor';
import { usePresence, useUserColor } from '../hooks/usePresence';
import { EditorCanvas } from './EditorCanvas';
import { Toolbar } from './Toolbar';
import { DocumentTitle } from './DocumentTitle';
import { PresenceLayer } from './PresenceLayer';

const ShareModal = lazy(() =>
  import('@/features/sharing/components/ShareModal').then(m => ({ default: m.ShareModal }))
);

export function EditorPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const { user } = useAuthContext();
  const color = useUserColor(user?.id ?? '');
  const [shareOpen, setShareOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () =>
      apiRequest<{ data: DocumentWithPermission[] }>('/api/documents').then(
        r => r.data.find(d => d.id === documentId)
      ),
    enabled: !!documentId,
  });

  const { collaborators, updatePresence } = usePresence(user?.id ?? '');

  const { editor } = useCollabEditor({
    documentId: documentId!,
    user: { name: user?.name ?? 'Anonymous', color },
    onAwarenessChange: updatePresence,
  });

  if (isLoading || !editor || !data) {
    return <EditorSkeleton />;
  }

  const editable = canEdit(data.role);
  const isOwner = data.role === 'OWNER';

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0 gap-4">
          <DocumentTitle id={data.id} title={data.title} canEdit={editable} />
          <div className="flex items-center gap-3 shrink-0">
            <PresenceLayer collaborators={collaborators} />
            {isOwner && (
              <button
                onClick={() => setShareOpen(true)}
                className="px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Share
              </button>
            )}
          </div>
        </div>

        {editable && <Toolbar editor={editor} />}

        <EditorCanvas editor={editor} />
      </div>

      {shareOpen && (
        <Suspense fallback={null}>
          <ShareModal documentId={data.id} onClose={() => setShareOpen(false)} />
        </Suspense>
      )}
    </ErrorBoundary>
  );
}
