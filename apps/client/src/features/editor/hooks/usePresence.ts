import { useRef, useMemo, useState } from 'react';
import type { PresenceUser } from '@livepad/shared';

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

export function useUserColor(userId: string): string {
  return useMemo(() => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
  }, [userId]);
}

export function usePresence(currentUserId: string) {
  const [collaborators, setCollaborators] = useState<PresenceUser[]>([]);
  const prevRef = useRef<PresenceUser[]>([]);

  const updatePresence = (users: PresenceUser[]) => {
    const others = users.filter(u => u.userId !== currentUserId);
    prevRef.current = others;
    setCollaborators(others);
  };

  const dedupedCollaborators = useMemo(() => {
    const seen = new Set<string>();
    return collaborators.filter(u => {
      if (seen.has(u.userId)) return false;
      seen.add(u.userId);
      return true;
    });
  }, [collaborators]);

  return { collaborators: dedupedCollaborators, updatePresence };
}
