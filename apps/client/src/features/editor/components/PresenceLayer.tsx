import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { PresenceStack } from './PresenceStack';
import type { PresenceUser } from '@livepad/shared';

interface Props {
  collaborators: PresenceUser[];
}

export function PresenceLayer({ collaborators }: Props) {
  return (
    <ErrorBoundary>
      <PresenceStack collaborators={collaborators} />
    </ErrorBoundary>
  );
}
