import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/stores/ui.store';

export function AppShell() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-200 ${
          sidebarOpen ? 'ml-60' : 'ml-0'
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
