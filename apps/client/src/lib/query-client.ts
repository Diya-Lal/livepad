import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: (failureCount, error) => {
        const err = error as { statusCode?: number };
        if (err.statusCode === 401 || err.statusCode === 403 || err.statusCode === 404) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
