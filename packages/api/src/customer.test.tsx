// Tests the customer hooks against the in-memory mock db.
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { createQueryClient } from './queryClient';
import { useBookings, useCreateBooking, useQuote } from './customer';

const client = createQueryClient();
const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

afterEach(async () => {
  await waitFor(() => expect(client.isFetching()).toBe(0));
  client.clear();
});

test('a booking created through the hook shows up in useBookings', async () => {
  const { result } = await renderHook(() => ({ list: useBookings(), create: useCreateBooking() }), { wrapper });
  await waitFor(() => expect(result.current.list.data).toHaveLength(2));
  await act(() =>
    result.current.create.mutateAsync({ serviceId: 'mowing', frequency: 'weekly', price: 57, startDate: '2026-10-21', addressId: 'addr-maple-ridge' }),
  );
  await waitFor(() => expect(result.current.list.data).toHaveLength(3));
});

test('useQuote waits for an address', async () => {
  const { result } = await renderHook(() => useQuote('mowing', null), { wrapper });
  expect(result.current.fetchStatus).toBe('idle');
});
