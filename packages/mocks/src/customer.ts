// Customer-side resolvers. Each waits like a network call and returns copies, never live db objects.
import { FREQUENCY_DAYS, addDays } from '@mowly/types';
import type { Address, Booking, BookingChange, Customer, NewBooking, PlanOption, Service, Thread } from '@mowly/types';
import { delay } from './delay';
import { find } from './find';
import { getDb, resetDb } from './db';
import { hash, lotSizeSqft, priceForLot } from './pricing';

/** All services in catalog order. */
export async function getServices(): Promise<Service[]> {
  await delay();
  return structuredClone(getDb().services);
}

/** One service by id. */
export async function getService(id: string): Promise<Service> {
  await delay();
  return structuredClone(find(getDb().services, id));
}

/** Addresses whose street line contains the query, ignoring case. */
export async function searchAddresses(query: string): Promise<Address[]> {
  await delay();
  const q = query.toLowerCase();
  return structuredClone(getDb().addresses.filter((a) => a.line1.toLowerCase().includes(q)));
}

/** A service's plans priced for one address, plus that address's lot size. */
export async function getQuote(serviceId: string, addressId: string): Promise<{ plans: PlanOption[]; lotSqft: number }> {
  await delay();
  const service = find(getDb().services, serviceId);
  find(getDb().addresses, addressId);
  const lotSqft = lotSizeSqft(addressId);
  return { plans: service.plans.map((p) => ({ ...p, price: priceForLot(p.price, lotSqft) })), lotSqft };
}

/** How many neighbors in a zip code use Mowly. */
export async function getNeighbors(zip: string): Promise<number> {
  await delay();
  return zip === '78704' ? 49 : 20 + (hash(zip) % 60);
}

/** The signed-in customer. */
export async function getCustomer(): Promise<Customer> {
  await delay();
  return structuredClone(getDb().customer);
}

/** Active bookings (not cancelled), newest first. */
export async function getBookings(): Promise<Booking[]> {
  await delay();
  const live = getDb().bookings.filter((b) => b.status !== 'cancelled');
  return structuredClone(live.sort((a, b) => b.createdAt - a.createdAt));
}

/** One booking by id. */
export async function getBooking(id: string): Promise<Booking> {
  await delay();
  return structuredClone(find(getDb().bookings, id));
}

/** Creates a scheduled booking with Greenleaf Lawn Co. */
export async function createBooking(input: NewBooking): Promise<Booking> {
  await delay();
  const db = getDb();
  const service = find(db.services, input.serviceId);
  const booking: Booking = {
    id: `b-${Date.now().toString(36)}-${db.bookings.length}`, serviceId: input.serviceId, serviceName: service.name,
    frequency: input.frequency, price: input.price, nextDate: input.startDate, status: 'scheduled', pausedUntil: null,
    proName: 'Greenleaf Lawn Co.', address: structuredClone(find(db.addresses, input.addressId)), createdAt: Date.now(),
  };
  db.bookings.push(booking);
  return structuredClone(booking);
}

/** Applies a skip, reschedule, frequency change, pause or cancel to a booking. */
export async function updateBooking(id: string, change: BookingChange): Promise<Booking> {
  await delay();
  const b = find(getDb().bookings, id);
  switch (change.type) {
    case 'skip': {
      b.nextDate = addDays(b.nextDate, FREQUENCY_DAYS[b.frequency]);
      break;
    }
    case 'reschedule': b.nextDate = change.date; break;
    case 'frequency': b.frequency = change.frequency; b.price = change.price; break;
    case 'pause': b.status = 'paused'; b.pausedUntil = change.until; break;
    case 'cancel': b.status = 'cancelled'; break;
  }
  return structuredClone(b);
}

/** All message threads. */
export async function getThreads(): Promise<Thread[]> {
  await delay();
  return structuredClone(getDb().threads);
}

/** One thread by id. */
export async function getThread(id: string): Promise<Thread> {
  await delay();
  return structuredClone(find(getDb().threads, id));
}

/** Appends the customer's message now and a canned pro reply 2000 ms later. */
export async function sendMessage(threadId: string, text: string): Promise<Thread> {
  await delay();
  const thread = find(getDb().threads, threadId);
  thread.messages.push({ id: `m-${Date.now()}-${thread.messages.length}`, from: 'customer', text, sentAt: Date.now() });
  setTimeout(() => {
    // Looked up again so a resetDb in between does not resurrect the old thread.
    const current = getDb().threads.find((t) => t.id === threadId);
    current?.messages.push({ id: `m-${Date.now()}-${current.messages.length}`, from: 'pro', text: "Thanks! We'll take care of it.", sentAt: Date.now() });
  }, 2000);
  return structuredClone(thread);
}

/** Restores the demo data. */
export async function resetDemo(): Promise<void> {
  await delay();
  resetDb();
}
