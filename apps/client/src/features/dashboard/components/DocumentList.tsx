import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import type { DocumentWithPermission } from '@livepad/shared';
import { DocumentCard } from './DocumentCard';
import { DocumentCardSkeleton } from '@/components/skeletons/DocumentCardSkeleton';

interface Props {
  documents: DocumentWithPermission[];
  isLoading: boolean;
}

export function DocumentList({ documents, isLoading }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: isLoading ? 6 : documents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,
    gap: 12,
  });

  if (!isLoading && documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No documents yet.</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Create one to get started.</p>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="overflow-y-auto flex-1">
      <div
        style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {isLoading ? (
              <DocumentCardSkeleton />
            ) : (
              <DocumentCard document={documents[virtualItem.index]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
