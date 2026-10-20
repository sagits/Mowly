// Tests Billing, Notifications and Account management.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getPro, setMockDelay } from '@mowly/mocks';
import { setToday } from '@mowly/types';
import { renderApp } from './renderApp';

test('billing starts empty', async () => {
  await renderApp('/settings/billing');
  expect(await screen.findByTestId('billing-empty')).toBeTruthy();
  expect(screen.getByTestId('billing-balance')).toHaveTextContent('$0.00');
});

// A second render in one test leaves overlapping act() scopes behind, so each state gets its own test.
test('billing lists past claimed jobs under both tabs', async () => {
  setToday('2026-10-21');
  try {
    await renderApp('/settings/billing');
    expect(await screen.findAllByTestId(/^billing-row-/)).toHaveLength(3);
    await fireEvent.press(screen.getByTestId('billing-all-time'));
    expect(screen.getAllByTestId(/^billing-row-/)).toHaveLength(3);
  } finally {
    setToday('2026-10-20');
  }
});

test('two quick toggles in one section both persist and keep the third', async () => {
  const before = await getPro();
  await renderApp('/settings/notifications');
  const text = await screen.findByTestId('notif-jobs-text');
  const push = screen.getByTestId('notif-jobs-push');
  // Slow mocks keep the first save and its refetch in flight, so the second toggle sees stale `pro`.
  setMockDelay(150, 150);
  try {
    await fireEvent(text, 'valueChange', false);
    await fireEvent(push, 'valueChange', false);
    setMockDelay(0, 0); // so the checks below do not wait on the slow mock
    await waitFor(async () => {
      const { notifications } = await getPro();
      expect(notifications.jobs.text).toBe(false);
      expect(notifications.jobs.push).toBe(false);
    });
    const { notifications } = await getPro();
    expect(notifications.jobs.email).toBe(before.notifications.jobs.email);
    expect(notifications.messages).toEqual(before.notifications.messages);
    await waitFor(() => expect(screen.getByTestId('notif-jobs-push')).toHaveProp('value', false));
    await waitFor(() => expect(screen.getByTestId('notif-jobs-text')).toHaveProp('value', false));
  } finally {
    setMockDelay(0, 0);
  }
});

test('account deletion is inert', async () => {
  const before = await getPro();
  await renderApp('/settings/account');
  await fireEvent.press(await screen.findByTestId('account-delete'));
  expect(await screen.findByTestId('account-delete-confirm')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('account-delete-confirm'));
  expect(await screen.findByTestId('toast')).toHaveTextContent('Not in this demo');
  expect(await getPro()).toEqual(before);
});
