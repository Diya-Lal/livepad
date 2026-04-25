import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

const DashboardPage = lazy(() =>
  import('@/features/dashboard/components/DashboardPage').then(m => ({ default: m.DashboardPage }))
);

const EditorPage = lazy(() =>
  import('@/features/editor/components/EditorPage').then(m => ({ default: m.EditorPage }))
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/register',
    element: <RegisterForm />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Suspense fallback={null}><DashboardPage /></Suspense>,
      },
      {
        path: 'dashboard',
        element: <Suspense fallback={null}><DashboardPage /></Suspense>,
      },
      {
        path: 'editor/:documentId',
        element: <Suspense fallback={null}><EditorPage /></Suspense>,
      },
    ],
  },
]);
