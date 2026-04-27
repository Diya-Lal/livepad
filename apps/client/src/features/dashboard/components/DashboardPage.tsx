import { useState } from 'react';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentList } from './DocumentList';
import { DashboardSearch } from './DashboardSearch';
import { CreateDocButton } from './CreateDocButton';

export function DashboardPage() {
  const [search, setSearch] = useState('');
  const { documents, isLoading } = useDocuments(search);

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Documents</h1>
        <CreateDocButton />
      </div>

      <DashboardSearch onSearch={setSearch} />

      <ErrorBoundary>
        <DocumentList documents={documents} isLoading={isLoading} />
      </ErrorBoundary>
    </div>
  );
}
