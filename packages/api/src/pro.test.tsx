// Tests the pro hooks against the in-memory mock db.
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { createQueryClient } from './queryClient';
import { useAvailableJobs, useClaimJob, useClaimedJobs } from './pro';

const client = createQueryClient();
const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

afterEach(async () => {
  await waitFor(() => expect(client.isFetching()).toBe(0));
  client.clear();
});

test('claiming invalidates available and claimed', async () => {
  const { result } = await renderHook(() => ({ a: useAvailableJobs(), c: useClaimedJobs(), claim: useClaimJob() }), { wrapper });
  await waitFor(() => expect(result.current.a.data).toHaveLength(10));
  await act(() => result.current.claim.mutateAsync({ id: 'job-01', date: result.current.a.data![0]!.availableDates[0]! }));
  await waitFor(() => {
    expect(result.current.a.data).toHaveLength(9);
    expect(result.current.c.data).toHaveLength(13);
  });
});
