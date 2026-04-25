import { useNavigate } from 'react-router-dom';
import { useCreateDocument } from '../hooks/useDocuments';

export function CreateDocButton() {
  const { mutate: create, isPending } = useCreateDocument();
  const navigate = useNavigate();

  const handleCreate = () => {
    create(undefined, {
      onSuccess: (doc) => {
        navigate(`/editor/${doc.id}`);
      },
    });
  };

  return (
    <button
      onClick={handleCreate}
      disabled={isPending}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
    >
      {isPending ? 'Creating...' : '+ New document'}
    </button>
  );
}
