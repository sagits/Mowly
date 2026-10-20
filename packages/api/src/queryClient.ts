/** The one query client factory, shared by both apps through `AppProviders`. */
import { QueryClient } from '@tanstack/react-query';

/** Creates a query client with the app-wide defaults. Called once per app, never at module scope. */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 2,
        refetchOnWindowFocus: true,
      },
    },
  });
