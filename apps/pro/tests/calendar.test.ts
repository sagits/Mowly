// Tests the month grid and day counts (pure functions).
import type { Job } from '@mowly/types';
import { countsByDay, monthGrid } from '../src/calendar';

test('October 2026 starts on a Thursday', () => {
  expect(monthGrid(2026, 9)[0]).toEqual([null, null, null, null, '2026-10-01', '2026-10-02', '2026-10-03']);
  expect(monthGrid(2026, 9).flat().filter(Boolean)).toHaveLength(31);
});

test('January 2027 starts on a Friday', () => expect(monthGrid(2027, 0)[0]!.indexOf('2027-01-01')).toBe(5));

test('every week has seven cells, the last one padded', () => {
  const weeks = monthGrid(2026, 10); // November 2026 starts on a Sunday and has 30 days
  expect(weeks.every((w) => w.length === 7)).toBe(true);
  expect(weeks[0]![0]).toBe('2026-11-01');
  expect(weeks.at(-1)).toEqual(['2026-11-29', '2026-11-30', null, null, null, null, null]);
});

test('counts are keyed by claimed date and skip unclaimed jobs', () => {
  const job = (claimedDate: string | null) => ({ claimedDate }) as Job;
  expect(countsByDay([job('2026-10-20'), job('2026-10-20'), job('2026-10-21'), job(null)])).toEqual({ '2026-10-20': 2, '2026-10-21': 1 });
});
