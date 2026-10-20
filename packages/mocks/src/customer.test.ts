// Tests the customer resolvers: reads, writes and seed options.
import {
  DEMO_ADDRESS_ID, configureMocks, createBooking, getBooking, getBookings, getNeighbors, getQuote, getServices, getThread,
  getThreads, resetDb, searchAddresses, sendMessage, updateBooking,
} from './index';
import { setToday } from '@mowly/types';

afterEach(() => {
  jest.useRealTimers();
  configureMocks({ seed: true });
  setToday('2026-10-20');
  resetDb();
});

test('catalog and seed', async () => {
  expect((await getServices()).map((s) => s.name)[0]).toBe('Mowing');
  expect(await getServices()).toHaveLength(11);
  expect((await getBookings()).map((b) => b.id)).toEqual(['b-mowing', 'b-treatment']);
  expect((await getBooking('b-mowing')).nextDate).toBe('2026-10-25');
  expect(await searchAddresses('maple')).toHaveLength(1);
  expect(await getNeighbors('78704')).toBe(49);
});
test('a new booking is the first thing the next read returns', async () => {
  const b = await createBooking({ serviceId: 'leaf-removal', frequency: 'one-time', price: 129, startDate: '2026-10-21', addressId: DEMO_ADDRESS_ID });
  expect((await getBookings())[0]!.id).toBe(b.id);
});
test('skip, pause and cancel', async () => {
  expect((await updateBooking('b-mowing', { type: 'skip' })).nextDate).toBe('2026-11-24');
  expect((await updateBooking('b-mowing', { type: 'pause', until: '2027-03-01' })).status).toBe('paused');
  await updateBooking('b-mowing', { type: 'cancel' });
  expect((await getBookings()).map((b) => b.id)).toEqual(['b-treatment']);
});
test('a canned reply arrives two seconds after sending', async () => {
  jest.useFakeTimers();
  await sendMessage('t-greenleaf', 'Can you come Friday?');
  jest.advanceTimersByTime(2000);
  expect((await getThread('t-greenleaf')).messages.at(-1)!.from).toBe('pro');
  jest.useRealTimers();
});
test('SEED=false empties the lists but keeps the catalog', async () => {
  configureMocks({ seed: false }); resetDb();
  expect(await getBookings()).toEqual([]);
  expect(await getThreads()).toEqual([]);
  expect(await getServices()).toHaveLength(11);
  configureMocks({ seed: true });
});
test('unknown ids reject', () => expect(getBooking('nope')).rejects.toThrow('Not found'));
test('a quote for an unknown address rejects', () => expect(getQuote('mowing', 'nope')).rejects.toThrow('Not found'));
