import { memo, useCallback } from 'react';

interface Props {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

export const ToolbarButton = memo(function ToolbarButton({ onClick, isActive, disabled, title, children }: Props) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  }, [onClick]);

  return (
    <button
      onMouseDown={handleClick}
      disabled={disabled}
      title={title}
      className={`px-2 py-1 text-sm rounded transition-colors ${
        isActive
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
});
