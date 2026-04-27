import type { PresenceUser } from '@livepad/shared';
import { CollaboratorAvatar } from './CollaboratorAvatar';
import { PresenceListSkeleton } from '@/components/skeletons/PresenceListSkeleton';

interface Props {
  collaborators: PresenceUser[];
  isLoading?: boolean;
  maxVisible?: number;
}

export function PresenceStack({ collaborators, isLoading, maxVisible = 5 }: Props) {
  if (isLoading) return <PresenceListSkeleton />;
  if (collaborators.length === 0) return null;

  const visible = collaborators.slice(0, maxVisible);
  const overflow = collaborators.length - maxVisible;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visible.map(user => (
          <CollaboratorAvatar key={user.userId} name={user.name} color={user.color} />
        ))}
      </div>
      {overflow > 0 && (
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">+{overflow}</span>
      )}
    </div>
  );
}
