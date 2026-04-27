import type { ReactNode } from 'react';

export function ToolbarGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 px-1 border-r border-gray-200 dark:border-gray-700 last:border-0">
      {children}
    </div>
  );
}
