// Customer-side query hooks: one per resolver in @mowly/mocks.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBooking, getBooking, getBookings, getCustomer, getNeighbors, getQuote, getService, getServices, getThread, getThreads,
  resetDemo, searchAddresses, sendMessage, updateBooking,
} from '@mowly/mocks';
import type { BookingChange, NewBooking } from '@mowly/types';
import { queryKeys } from './queryKeys';

/** The service catalog. */
export const useServices = () => useQuery({ queryKey: queryKeys.services, queryFn: getServices });

/** One service by id. */
export const useService = (id: string) => useQuery({ queryKey: queryKeys.service(id), queryFn: () => getService(id) });

/** Addresses matching the typed text. */
export const useAddressSearch = (query: string) =>
  useQuery({ queryKey: queryKeys.addresses(query), queryFn: () => searchAddresses(query) });

/** Plan prices for a service at an address. Idle until both are chosen. */
export const useQuote = (serviceId: string | null, addressId: string | null) =>
  useQuery({
    queryKey: queryKeys.quote(serviceId, addressId),
    queryFn: () => getQuote(serviceId!, addressId!),
    enabled: serviceId !== null && addressId !== null,
  });

/** How many neighbors in a zip code already use Mowly. */
export const useNeighbors = (zip: string) => useQuery({ queryKey: queryKeys.neighbors(zip), queryFn: () => getNeighbors(zip) });

/** The signed-in demo customer. */
export const useCustomer = () => useQuery({ queryKey: queryKeys.customer, queryFn: getCustomer });

/** All of the customer's bookings, newest first. */
export const useBookings = () => useQuery({ queryKey: queryKeys.bookings, queryFn: getBookings });

/** One booking by id. */
export const useBooking = (id: string) => useQuery({ queryKey: queryKeys.booking(id), queryFn: () => getBooking(id) });

/** All message threads. */
export const useThreads = () => useQuery({ queryKey: queryKeys.threads, queryFn: getThreads });

/** One thread. Polls every second while the last message is the customer's, so the canned reply shows up. */
export const useThread = (id: string) =>
  useQuery({
    queryKey: queryKeys.thread(id),
    queryFn: () => getThread(id),
    refetchInterval: (query) => (query.state.data?.messages.at(-1)?.from === 'customer' ? 1000 : false),
  });

/** Creates a booking and refreshes the bookings lists. */
export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: NewBooking) => createBooking(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.bookings }),
  });
};

/** Changes a booking (skip, pause, cancel) and refreshes the bookings lists. */
export const useUpdateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, change }: { id: string; change: BookingChange }) => updateBooking(id, change),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.bookings }),
  });
};

/** Sends a customer message and refreshes the threads. */
export const useSendMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, text }: { threadId: string; text: string }) => sendMessage(threadId, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.threads }),
  });
};

/** Restores the demo data and refreshes every query. */
export const useResetDemo = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: resetDemo, onSuccess: () => qc.invalidateQueries() });
};
