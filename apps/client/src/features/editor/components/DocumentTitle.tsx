import { useState } from 'react';
import { useUpdateDocument } from '@/features/dashboard/hooks/useDocuments';
import { useDebounce } from '../hooks/useDebounce';
import { useEffect } from 'react';

interface Props {
  id: string;
  title: string;
  canEdit: boolean;
}

export function DocumentTitle({ id, title, canEdit }: Props) {
  const [value, setValue] = useState(title);
  const debouncedValue = useDebounce(value, 800);
  const { mutate: update } = useUpdateDocument();

  useEffect(() => {
    if (debouncedValue !== title && debouncedValue.trim()) {
      update({ id, title: debouncedValue.trim() });
    }
  }, [debouncedValue]);

  if (!canEdit) {
    return <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>;
  }

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none w-full placeholder-gray-400"
      placeholder="Untitled"
    />
  );
}
