import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DocumentWithPermission } from '@livepad/shared';
import { canEdit } from '@livepad/shared';
import { DocumentCardMenu } from './DocumentCardMenu';

interface Props {
  document: DocumentWithPermission;
}

export const DocumentCard = memo(function DocumentCard({ document }: Props) {
  const navigate = useNavigate();
  const editable = canEdit(document.role);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(document.updatedAt));

  return (
    <div
      onClick={() => navigate(`/editor/${document.id}`)}
      className="group relative p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{document.title}</p>
        <DocumentCardMenu id={document.id} title={document.title} canEdit={editable} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-400 dark:text-gray-500">{formattedDate}</span>
        {document.role !== 'OWNER' && (
          <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
            {document.role.toLowerCase()}
          </span>
        )}
      </div>
    </div>
  );
});
