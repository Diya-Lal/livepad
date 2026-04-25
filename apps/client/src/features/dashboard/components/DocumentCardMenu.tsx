import { useState, useRef, useEffect } from 'react';
import { useUpdateDocument, useDeleteDocument } from '../hooks/useDocuments';

interface Props {
  id: string;
  title: string;
  canEdit: boolean;
}

export function DocumentCardMenu({ id, title, canEdit }: Props) {
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: update } = useUpdateDocument();
  const { mutate: remove } = useDeleteDocument();

  useEffect(() => {
    if (renaming) inputRef.current?.focus();
  }, [renaming]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== title) {
      update({ id, title: newTitle.trim() });
    }
    setRenaming(false);
    setOpen(false);
  };

  if (renaming) {
    return (
      <input
        ref={inputRef}
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        onBlur={handleRename}
        onKeyDown={e => {
          if (e.key === 'Enter') handleRename();
          if (e.key === 'Escape') { setRenaming(false); setNewTitle(title); }
        }}
        onClick={e => e.stopPropagation()}
        className="text-sm font-medium w-full bg-transparent border-b border-blue-500 outline-none text-gray-900 dark:text-white"
      />
    );
  }

  return (
    <div ref={menuRef} className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        aria-label="Document options"
      >
        ···
      </button>

      {open && (
        <div className="absolute right-0 top-6 z-10 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
          {canEdit && (
            <button
              onClick={() => { setRenaming(true); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Rename
            </button>
          )}
          <button
            onClick={() => { remove(id); setOpen(false); }}
            className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
