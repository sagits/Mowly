/** Everything an app sits inside: the query client, the safe-area context and the toast host. */
import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createQueryClient } from '@mowly/api';
import { ToastHost } from '@mowly/ui';

/**
 * Wraps an app in its providers. The query client is created in a `useState` initialiser rather
 * than at module scope, because a module-scope client is one cache shared by every test file.
 * Tests may pass their own `queryClient`.
 */
export function AppProviders({ children, queryClient }: { children: ReactNode; queryClient?: QueryClient }) {
  const [defaultClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient ?? defaultClient}>
      <SafeAreaProvider>
        {children}
        <ToastHost />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
