// Local-time date helpers on 'YYYY-MM-DD' strings. No Intl: names are built by hand so output is the same on every engine.
import type { IsoDate } from './domain';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let override: IsoDate | null = null;

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (d: Date): IsoDate => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (date: IsoDate): Date => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** Today's date, or the value set with `setToday`. */
export function today(): IsoDate {
  return override ?? toIso(new Date());
}

/** Pins `today()` to a date (for tests); null restores the real clock. */
export function setToday(date: IsoDate | null): void {
  override = date;
}

/** The date `days` after `date`; negative goes back. */
export function addDays(date: IsoDate, days: number): IsoDate {
  const d = parse(date);
  d.setDate(d.getDate() + days);
  return toIso(d);
}

/** The first Monday to Friday strictly after `from` (default today). */
export function nextWeekday(from: IsoDate = today()): IsoDate {
  let next = addDays(from, 1);
  while ([0, 6].includes(parse(next).getDay())) next = addDays(next, 1);
  return next;
}

/** 'Sunday, October 25' */
export function formatLong(date: IsoDate): string {
  const d = parse(date);
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** 'Oct 25' */
export function formatShort(date: IsoDate): string {
  const d = parse(date);
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

/** 'Sun' */
export function weekdayShort(date: IsoDate): string {
  return WEEKDAYS[parse(date).getDay()].slice(0, 3);
}

/** '$53.00' */
export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
