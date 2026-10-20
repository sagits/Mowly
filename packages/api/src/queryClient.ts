/** The one query client factory, shared by both apps through `AppProviders`. */
import { QueryClient } from '@tanstack/react-query';

/**
 * Creates a query client with the app-wide defaults. Called once per app, never at module scope.
 * Under Jest, no retries and no garbage-collection timers: either one keeps a green run from exiting.
 */
export const createQueryClient = () =>
  process.env.NODE_ENV === 'test'
    ? new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: 0, notifyOnChangeProps: 'all' },
          mutations: { gcTime: 0 },
        },
      })
    : new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 2, refetchOnWindowFocus: true },
        },
      });
