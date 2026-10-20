// Tests Available Jobs: pins, pager, day filter and claiming (P10).
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { claimJob, getAvailableJobs, getClaimedJobs } from '@mowly/mocks';
import { addDays, today } from '@mowly/types';
import { showToast } from '@mowly/ui';
import { renderApp } from './renderApp';

jest.mock('@mowly/ui', () => {
  const actual = jest.requireActual('@mowly/ui');
  return { ...actual, showToast: jest.fn(actual.showToast) };
});


beforeEach(() => jest.clearAllMocks());

test('ten pins, the pager follows the pins', async () => {
  await renderApp('/jobs');
  expect(await screen.findAllByTestId(/^pin-job-/)).toHaveLength(10);
  expect(screen.getByTestId('pager-label')).toHaveTextContent('1 of 10 jobs');
  await fireEvent.press(screen.getByTestId('pager-next'));
  expect(screen.getByTestId('pager-label')).toHaveTextContent('2 of 10 jobs');
  await fireEvent.press(screen.getByTestId('pin-job-05'));
  expect(screen.getByTestId('pager-label')).toHaveTextContent('5 of 10 jobs');
  await fireEvent.press(screen.getByTestId('pager-prev'));
  expect(screen.getByTestId('pager-label')).toHaveTextContent('4 of 10 jobs');
});

test('the day filter narrows the list', async () => {
  const day = addDays(today(), 1);
  const expected = (await getAvailableJobs(day)).length;
  expect(expected).toBeLessThan(10);
  await renderApp('/jobs');
  await screen.findAllByTestId(/^pin-job-/);
  await fireEvent.press(screen.getByTestId('pager-next'));
  await fireEvent.press(screen.getByTestId(`day-${day}`));
  await waitFor(() => expect(screen.getByTestId('pager-label')).toHaveTextContent(`1 of ${expected} jobs`));
  expect(screen.getAllByTestId(/^pin-job-/)).toHaveLength(expected);
  const rows = screen.getAllByTestId(/^job-date-/);
  expect(rows.some((r) => r.props.testID.endsWith(day))).toBe(true);
});

test('claiming once removes the job; a second press is a no-op', async () => {
  await renderApp('/jobs');
  const row = (await screen.findAllByTestId(/^job-date-job-01-/))[0]!;
  await fireEvent.press(row);
  const confirm = screen.getByTestId('claim-confirm');
  // Both taps land inside one act(), before `isPending` has rendered: only the ref guard stops the second.
  await act(async () => {
    confirm.props.onClick({});
    confirm.props.onClick({});
  });
  expect(await screen.findByText('Job claimed')).toBeTruthy();
  await waitFor(() => expect(screen.queryByTestId('pin-job-01')).toBeNull());
  for (let i = 0; i < 5; i++) await act(async () => {}); // let a stray second claim settle
  // An unguarded second call would reject with 'Already claimed' and toast again.
  expect(showToast).toHaveBeenCalledTimes(1);
  expect(showToast).toHaveBeenCalledWith('Job claimed');
  await waitFor(() => expect(screen.queryByTestId('pin-job-01')).toBeNull());
  expect(await getClaimedJobs()).toHaveLength(13);
});

test('claiming an already claimed job shows a toast', async () => {
  await renderApp('/jobs');
  const row = (await screen.findAllByTestId(/^job-date-job-01-/))[0]!;
  await fireEvent.press(row);
  await claimJob('job-01', today());
  await fireEvent.press(screen.getByTestId('claim-confirm'));
  expect(await screen.findByText('This job was already claimed')).toBeTruthy();
  await waitFor(() => expect(screen.queryByTestId('pin-job-01')).toBeNull());
  expect(await getClaimedJobs()).toHaveLength(13);
});
