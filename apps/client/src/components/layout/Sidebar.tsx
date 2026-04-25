import { NavLink } from 'react-router-dom';
import { useUIStore } from '@/stores/ui.store';

export function Sidebar() {
  const { sidebarOpen } = useUIStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-10">
      <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-bold text-blue-600">Livepad</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          Documents
        </NavLink>
      </nav>
    </aside>
  );
}
