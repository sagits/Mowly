// Tests the pro resolvers and the relative seed dates.
import { addDays, setToday, today } from '@mowly/types';
import { claimJob, configureMocks, getAvailableJobs, getBilling, getClaimedJobs, getPro, getTodayRoute, resetDb, updatePro } from './index';

afterEach(() => {
  configureMocks({ seed: true });
  setToday('2026-10-20');
  resetDb();
});

test('seed invariants', async () => {
  const available = await getAvailableJobs();
  expect(available).toHaveLength(10);
  for (const j of available) {
    expect(j.price).toBeGreaterThanOrEqual(29.99); expect(j.price).toBeLessThanOrEqual(40.99);
    for (const d of j.availableDates) { expect(d >= today()).toBe(true); expect(d <= addDays(today(), 4)).toBe(true); }
  }
  expect(new Set(available.map((j) => j.serviceName)).size).toBeGreaterThanOrEqual(3);
  const claimed = await getClaimedJobs();
  expect(claimed).toHaveLength(12);
  expect(claimed.every((j) => j.claimedDate! >= today())).toBe(true);
  expect((await getTodayRoute()).map((j) => j.id)).toEqual(['job-11', 'job-12', 'job-13']);
  expect(await getBilling()).toEqual({ balance: 0, entries: [] });
});
test('the day filter', async () => {
  const day = addDays(today(), 1);
  expect((await getAvailableJobs(day)).every((j) => j.availableDates.includes(day))).toBe(true);
});
test('claiming for today moves the job to the end of the route', async () => {
  const job = (await getAvailableJobs(today()))[0]!;
  await claimJob(job.id, today());
  expect((await getAvailableJobs()).find((j) => j.id === job.id)).toBeUndefined();
  expect((await getTodayRoute()).at(-1)!.id).toBe(job.id);
  await expect(claimJob(job.id, today())).rejects.toThrow('Already claimed');
});
test('dates roll over a year boundary', async () => {
  setToday('2026-12-30'); resetDb();
  const dates = (await getAvailableJobs()).flatMap((j) => j.availableDates);
  expect(dates.some((d) => d.startsWith('2027-01'))).toBe(true);
});
test('claimed dates stay within the current and next month late in a month', async () => {
  for (const [day, last] of [['2026-10-30', '2026-11-30'], ['2027-01-31', '2027-02-28']] as const) {
    setToday(day); resetDb();
    const claimed = await getClaimedJobs();
    expect(claimed.every((j) => j.claimedDate! >= day && j.claimedDate! <= last)).toBe(true);
    expect(claimed.filter((j) => j.claimedDate === day)).toHaveLength(3);
  }
});
test('updatePro merges', async () => {
  await updatePro({ bankLinked: true });
  expect((await getPro()).bankLinked).toBe(true);
  expect((await getPro()).businessName).toBe('Sullivan Lawn Care');
});
test('SEED=false empties the job lists but keeps the pro', async () => {
  configureMocks({ seed: false }); resetDb();
  expect(await getAvailableJobs()).toEqual([]); expect(await getClaimedJobs()).toEqual([]);
  expect(await getTodayRoute()).toEqual([]); expect(await getBilling()).toEqual({ balance: 0, entries: [] });
  expect((await getPro()).firstName).toBe('Mike');
});
