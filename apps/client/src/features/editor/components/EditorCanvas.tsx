import { useEffect } from 'react';
import { EditorContent, type Editor } from '@tiptap/react';

interface Props {
  editor: Editor;
}

export function EditorCanvas({ editor }: Props) {
  useEffect(() => {
    editor.commands.focus();
  }, [editor]);

  return (
    <div className="flex-1 overflow-y-auto">
      <EditorContent
        editor={editor}
        className="prose prose-gray dark:prose-invert max-w-3xl mx-auto px-8 py-6 min-h-full focus:outline-none"
      />
    </div>
  );
}
