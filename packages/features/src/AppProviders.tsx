/** Everything an app sits inside: the query client and the safe-area context. */
import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { createQueryClient } from '@mowly/api';

/**
 * Wraps an app in its providers. The query client is created in a `useState` initialiser rather
 * than at module scope, because a module-scope client is one cache shared by every test file.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </QueryClientProvider>
  );
}
