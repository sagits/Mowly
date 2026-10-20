// Tests Billing, Notifications and Account management.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getPro } from '@mowly/mocks';
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

test('a notification toggle persists and keeps the others', async () => {
  const before = await getPro();
  await renderApp('/settings/notifications');
  await fireEvent(await screen.findByTestId('notif-jobs-text'), 'valueChange', false);
  await fireEvent(screen.getByTestId('notif-messages-push'), 'valueChange', false);
  await waitFor(async () => {
    const { notifications } = await getPro();
    expect(notifications.jobs.text).toBe(false);
    expect(notifications.messages.push).toBe(false);
  });
  const { notifications } = await getPro();
  expect(notifications.jobs.email).toBe(before.notifications.jobs.email);
  expect(notifications.messages.email).toBe(before.notifications.messages.email);
  await waitFor(() => expect(screen.getByTestId('notif-jobs-text')).toHaveProp('value', false));
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
