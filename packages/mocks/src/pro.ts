// Pro-side resolvers. Each waits like a network call and returns copies, never live db objects.
import { today } from '@mowly/types';
import type { Billing, IsoDate, Job, Pro, Recommendation } from '@mowly/types';
import { find } from './customer';
import { delay } from './delay';
import { getDb } from './db';

const byRoute = (a: Job, b: Job) => (a.routeOrder ?? 0) - (b.routeOrder ?? 0);

/** The signed-in pro. */
export async function getPro(): Promise<Pro> {
  await delay();
  return structuredClone(getDb().pro);
}

/** Merges a patch into the pro and returns the result. */
export async function updatePro(patch: Partial<Pro>): Promise<Pro> {
  await delay();
  const db = getDb();
  db.pro = { ...db.pro, ...structuredClone(patch) };
  return structuredClone(db.pro);
}

/** Unclaimed jobs in id order; with `day`, only those offering that date. */
export async function getAvailableJobs(day?: IsoDate): Promise<Job[]> {
  await delay();
  const open = getDb().jobs.filter((j) => j.claimedDate === null && (!day || j.availableDates.includes(day)));
  return structuredClone(open.sort((a, b) => a.id.localeCompare(b.id)));
}

/** Claimed jobs, by date and then route order. */
export async function getClaimedJobs(): Promise<Job[]> {
  await delay();
  const claimed = getDb().jobs.filter((j) => j.claimedDate !== null);
  return structuredClone(claimed.sort((a, b) => a.claimedDate!.localeCompare(b.claimedDate!) || byRoute(a, b)));
}

/** One job by id. */
export async function getJob(id: string): Promise<Job> {
  await delay();
  return structuredClone(find(getDb().jobs, id));
}

/** Claims a job for a date; a job claimed for today goes to the end of today's route. */
export async function claimJob(id: string, date: IsoDate): Promise<Job> {
  await delay();
  const db = getDb();
  const job = find(db.jobs, id);
  if (job.claimedDate !== null) throw new Error('Already claimed');
  job.claimedDate = date;
  if (date === today()) {
    job.routeOrder = Math.max(0, ...db.jobs.filter((j) => j.claimedDate === date).map((j) => j.routeOrder ?? 0)) + 1;
  }
  return structuredClone(job);
}

/** Jobs claimed for today, in route order. */
export async function getTodayRoute(): Promise<Job[]> {
  await delay();
  const route = getDb().jobs.filter((j) => j.claimedDate === today());
  return structuredClone(route.sort(byRoute));
}

/** One entry per claimed job dated before today, and their sum as the balance. */
export async function getBilling(): Promise<Billing> {
  await delay();
  const done = getDb().jobs.filter((j) => j.claimedDate !== null && j.claimedDate < today());
  const entries = done.map((j) => ({ jobId: j.id, date: j.claimedDate!, description: `${j.serviceName}, ${j.address.line1}`, amount: j.price }));
  return { balance: Math.round(entries.reduce((sum, e) => sum + e.amount, 0) * 100) / 100, entries };
}

/** Saves a service recommendation for a customer. */
export async function sendRecommendation(input: Omit<Recommendation, 'id'>): Promise<Recommendation> {
  await delay();
  const db = getDb();
  const rec: Recommendation = { ...input, id: `rec-${db.recommendations.length + 1}` };
  db.recommendations.push(rec);
  return structuredClone(rec);
}
