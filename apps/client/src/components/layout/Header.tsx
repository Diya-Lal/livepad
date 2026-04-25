import { useUIStore } from '@/stores/ui.store';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLogout } from '@/features/auth/hooks/useAuth';

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { toggleTheme, theme } = useTheme();
  const { user } = useAuthContext();
  const { mutate: logout } = useLogout();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
      <button
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
      >
        ☰
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
            <button
              onClick={() => logout()}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
