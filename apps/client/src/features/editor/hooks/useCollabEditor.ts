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
  const ydocRef = useRef(new Y.Doc());
  const providerRef = useRef(
    new HocuspocusProvider({
      url: 'ws://localhost:3002',
      name: documentId,
      document: ydocRef.current,
      token: getAccessToken() ?? '',
    })
  );

  const onAwarenessChangeRef = useRef(onAwarenessChange);
  onAwarenessChangeRef.current = onAwarenessChange;

  useEffect(() => {
    const provider = providerRef.current;
    const handler = ({ states }: { states: Map<number, Record<string, unknown>> }) => {
      const users: PresenceUser[] = [];
      states.forEach((data, clientId) => {
        if (data.userId) {
          users.push({ clientId, ...(data as Omit<PresenceUser, 'clientId'>) });
        }
      });
      onAwarenessChangeRef.current?.(users);
    };

    provider.on('awarenessChange', handler);
    return () => {
      provider.off('awarenessChange', handler);
      provider.destroy();
      ydocRef.current.destroy();
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydocRef.current }),
      CollaborationCursor.configure({
        provider: providerRef.current,
        user: { name: user.name, color: user.color },
      }),
    ],
  });

  return { editor, provider: providerRef.current };
}
