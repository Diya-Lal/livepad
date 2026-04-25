import { useTransition, useDeferredValue, useState } from 'react';

interface Props {
  onSearch: (value: string) => void;
}

export function DashboardSearch({ onSearch }: Props) {
  const [value, setValue] = useState('');
  const [, startTransition] = useTransition();
  const deferred = useDeferredValue(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    startTransition(() => {
      onSearch(e.target.value);
    });
  };

  const isStale = value !== deferred;

  return (
    <input
      type="search"
      value={value}
      onChange={handleChange}
      placeholder="Search documents..."
      className={`w-full max-w-sm px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-opacity ${
        isStale ? 'opacity-60' : 'opacity-100'
      }`}
    />
  );
}
