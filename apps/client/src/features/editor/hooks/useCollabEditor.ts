import { useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { getAccessToken } from '@/lib/api-client';
import type { PresenceUser } from '@livepad/shared';

interface UseCollabEditorOptions {
  documentId: string;
  user: { name: string; color: string };
  onAwarenessChange?: (users: PresenceUser[]) => void;
}

export function useCollabEditor({ documentId, user, onAwarenessChange }: UseCollabEditorOptions) {
  const ydocRef = useRef<Y.Doc>(new Y.Doc());
  const providerRef = useRef<HocuspocusProvider | null>(null);

  useEffect(() => {
    const provider = new HocuspocusProvider({
      url: `ws://localhost:3001`,
      name: documentId,
      document: ydocRef.current,
      token: getAccessToken() ?? '',
      onAwarenessChange: ({ states }) => {
        const users = states
          .map(({ clientId, ...data }) => ({ clientId, ...(data as Omit<PresenceUser, 'clientId'>) }))
          .filter(u => u.userId);
        onAwarenessChange?.(users as PresenceUser[]);
      },
    });

    providerRef.current = provider;

    return () => {
      provider.destroy();
    };
  }, [documentId]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydocRef.current }),
      CollaborationCursor.configure({
        provider: providerRef.current!,
        user: { name: user.name, color: user.color },
      }),
    ],
  });

  return { editor, provider: providerRef.current };
}
