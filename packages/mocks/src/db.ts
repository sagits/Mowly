// The in-memory "server" both apps read through their query hooks.
import type { Address, Booking, Customer, Job, Pro, Recommendation, Service, Thread } from '@mowly/types';
import { createSeed } from './seed';

/** Everything the mock server holds. */
export type MockDb = {
  services: Service[]; addresses: Address[]; customer: Customer; bookings: Booking[]; threads: Thread[];
  pro: Pro; jobs: Job[]; recommendations: Recommendation[];
  crew: CrewMember[]; performance: PerformanceStat[]; proThreads: Thread[];
};

/** A member of the pro's crew. */
export type CrewMember = { id: string; name: string; role: string };
/** One headline number on the Performance screen. */
export type PerformanceStat = { label: string; value: string };

let seeded = true;
let db: MockDb | null = null;

/** Chooses whether `resetDb` fills the lists (true) or leaves them empty (false). Takes effect on the next reset. */
export function configureMocks({ seed }: { seed: boolean }): void {
  seeded = seed;
}

/** Rebuilds the database from the seed. With seed off, lists are empty but the catalog, addresses and people stay. */
export function resetDb(): void {
  const full = createSeed();
  db = seeded ? full : { ...full, bookings: [], threads: [], jobs: [], recommendations: [], crew: [], performance: [], proThreads: [] };
}

/** The live database. Resolvers must copy before returning. */
export function getDb(): MockDb {
  if (!db) resetDb();
  return db!;
}
