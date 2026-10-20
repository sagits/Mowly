// Tests the Calendar (P11), the day list and the job detail.
import { fireEvent, screen, within } from '@testing-library/react-native';
import { claimJob, getJob } from '@mowly/mocks';
import { addDays, setToday, today } from '@mowly/types';
import { renderApp } from './renderApp';

test('today shows 3 jobs and opens the day, then a job', async () => {
  await renderApp('/calendar');
  expect(await screen.findByTestId('day-today-count')).toHaveTextContent('3');
  await fireEvent.press(screen.getByTestId('day-today'));
  expect(await screen.findByTestId('day-view-route')).toBeTruthy();
  await fireEvent.press(await screen.findByTestId('day-job-job-11'));
  await fireEvent.press(await screen.findByTestId('job-recommend'));
  expect(screen).toHavePathname('/jobs/job-11/recommend');
  expect(screen.getByTestId('screen-recommend')).toBeTruthy();
});

test('the day view opens the route', async () => {
  await renderApp(`/calendar/${today()}`);
  await fireEvent.press(await screen.findByTestId('day-view-route'));
  expect(screen).toHavePathname('/route');
  expect(screen.getByTestId('screen-route')).toBeTruthy();
});

test('a day that is not today has no route button', async () => {
  await renderApp(`/calendar/${addDays(today(), 1)}`);
  expect(await screen.findByTestId('day-job-job-14')).toBeTruthy();
  expect(screen.queryByTestId('day-view-route')).toBeNull();
});

test('a job claimed for a later day shows on that day', async () => {
  const date = (await getJob('job-01')).availableDates.at(-1)!;
  expect(date).toBe(addDays(today(), 3)); // no seed job is claimed for that day yet
  await claimJob('job-01', date);
  await renderApp('/calendar');
  const calendar = within(await screen.findByTestId('screen-calendar'));
  expect(await calendar.findByTestId(`day-${date}-count`)).toHaveTextContent('1');
  await fireEvent.press(calendar.getByTestId(`day-${date}`));
  expect(await screen.findByTestId('day-job-job-01')).toBeTruthy();
});

test('across a month boundary: today in October, November starting on a Sunday', async () => {
  setToday('2026-10-31');
  try {
    await renderApp('/calendar');
    const calendar = within(await screen.findByTestId('screen-calendar'));
    expect(calendar.getByText('October 2026')).toBeTruthy();
    expect(calendar.getByText('November 2026')).toBeTruthy();
    expect(within(calendar.getByTestId('month-2026-10')).getByTestId('day-today')).toBeTruthy();
    expect(within(calendar.getByTestId('month-2026-11')).queryByTestId('day-today')).toBeNull();
    // November 1st opens the first week row, under SUN.
    const firstCell = calendar.getByTestId('week-2026-11-0').children[0] as Parameters<typeof within>[0];
    expect(within(firstCell).getByTestId('day-2026-11-01')).toBeTruthy();
    // The seed was built on Oct 20, so the job claimed 12 days later lands on November 1st.
    expect(await calendar.findByTestId('day-2026-11-01-count')).toHaveTextContent('1');
  } finally {
    setToday('2026-10-20');
  }
});

test('the job detail shows the job', async () => {
  await renderApp('/jobs/job-11');
  expect(await screen.findByText('3815 Speedway')).toBeTruthy();
  expect(screen.getByText('Gate code is on the side fence. Please close the latch.')).toBeTruthy();
});
