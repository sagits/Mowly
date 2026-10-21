// Tests the date helpers and formatters.
import { addDays, dateOf, formatLong, formatMoney, formatShort, nextWeekday, setToday, today, weekdayShort } from './dates';

beforeEach(() => setToday('2026-10-20')); // a Tuesday
afterAll(() => setToday(null));

test('addDays crosses month and year', () => {
  expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
  expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
});
test('nextWeekday skips the weekend', () => {
  expect(nextWeekday()).toBe('2026-10-21');
  expect(nextWeekday('2026-10-23')).toBe('2026-10-26');
});
test('formats', () => {
  expect(formatLong('2026-10-25')).toBe('Sunday, October 25');
  expect(formatShort('2026-10-25')).toBe('Oct 25');
  expect(weekdayShort('2026-10-25')).toBe('Sun');
  expect(formatMoney(53)).toBe('$53.00');
  expect(formatMoney(29.99)).toBe('$29.99');
});
test('today follows the override', () => expect(today()).toBe('2026-10-20'));
test('today without an override is a local date', () => {
  setToday(null);
  expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test('dateOf gives the local calendar date of a timestamp', () => {
  expect(dateOf(new Date(2026, 9, 19, 14, 30).getTime())).toBe('2026-10-19');
});
