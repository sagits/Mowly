/** Month grid and per-day counts for the Calendar. Local date parts only, so no UTC drift. */
import type { IsoDate, Job } from '@mowly/types';

const pad = (n: number) => String(n).padStart(2, '0');

/** Sunday-first weeks of the month (`month0` is 0 for January), padded with null. */
export function monthGrid(year: number, month0: number): (IsoDate | null)[][] {
  const lead = new Date(year, month0, 1).getDay();
  const days = new Date(year, month0 + 1, 0).getDate();
  const cells: (IsoDate | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: days }, (_, i): IsoDate => `${year}-${pad(month0 + 1)}-${pad(i + 1)}`),
  ];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

/** Number of claimed jobs per `claimedDate`. */
export function countsByDay(jobs: Job[]): Record<IsoDate, number> {
  const counts: Record<IsoDate, number> = {};
  for (const { claimedDate } of jobs) if (claimedDate) counts[claimedDate] = (counts[claimedDate] ?? 0) + 1;
  return counts;
}
