// Tests the Pick your plan step (C08-C12): preselect, promo, start date sheet, exits.
import { router } from 'expo-router';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';
import { renderApp } from './renderApp';

beforeEach(() => {
  useQuoteDraft.getState().reset();
  useQuoteDraft.getState().selectService('mowing');
  useQuoteDraft.getState().setContact({ name: 'Renato Probst', addressId: 'addr-maple-ridge', addressText: '1820 Maple Ridge Drive, Austin, TX 78704', apt: '', phone: '5125550147' });
});
// renderApp (expo-router's renderRouter) installs fake timers; leave the next file's setup clean.
// Advance them inside an async act: a synchronous act around the advance broke every later render in the file.
afterEach(() => jest.useRealTimers());

test('recommended weekly is preselected at $57', async () => {
  await renderApp('/quote/plan');
  await screen.findByTestId('plan-row-weekly');
  expect(screen.getByTestId('cost-per-service')).toHaveTextContent('$57');
  expect(useQuoteDraft.getState().startDate).toBe('2026-10-21');
});

test('promo stays applied across a plan change', async () => {
  await renderApp('/quote/plan');
  await fireEvent.press(await screen.findByTestId('promo-open'));
  await fireEvent.changeText(screen.getByTestId('promo-input'), 'SPRING');
  await fireEvent.press(screen.getByTestId('promo-apply'));
  await fireEvent.press(screen.getByTestId('plan-row-monthly'));
  expect(screen.getByTestId('cost-per-service')).toHaveTextContent('$55');
  expect(screen.getByTestId('promo-applied')).toBeTruthy();
});

test('the date sheet lists 14 days from the next weekday', async () => {
  await renderApp('/quote/plan');
  await fireEvent.press(await screen.findByTestId('plan-start-date'));
  expect(screen.getByTestId('date-option-2026-10-21')).toBeTruthy();
  expect(screen.getByTestId('date-option-2026-11-03')).toBeTruthy();
  expect(screen.queryByTestId('date-option-2026-11-04')).toBeNull();
  await fireEvent.press(screen.getByTestId('date-option-2026-10-23'));
  expect(useQuoteDraft.getState().startDate).toBe('2026-10-23');
});

test('not looking goes back to service select', async () => {
  await renderApp('/quote/plan');
  await fireEvent.press(await screen.findByTestId('plan-not-looking'));
  await waitFor(() => expect(screen).toHavePathname('/quote'));
});

test('continue spins and opens the account step once', async () => {
  await renderApp('/quote/plan');
  await screen.findByTestId('plan-row-weekly');
  await fireEvent.press(screen.getByTestId('quote-continue'));
  await fireEvent.press(screen.getByTestId('quote-continue')); // a second press is ignored
  expect(screen.getByTestId('quote-continue-spinner')).toBeTruthy();
  await act(async () => jest.advanceTimersByTime(800));
  await waitFor(() => expect(screen).toHavePathname('/quote/account'));
  await act(async () => router.back()); // one push only: back lands on the plan, not a second account
  await waitFor(() => expect(screen).toHavePathname('/quote/plan'));
});

test('back from the account step, continue is usable again', async () => {
  await renderApp('/quote/plan');
  await screen.findByTestId('plan-row-weekly');
  await fireEvent.press(screen.getByTestId('quote-continue'));
  await act(async () => jest.advanceTimersByTime(800));
  await waitFor(() => expect(screen).toHavePathname('/quote/account'));
  await act(async () => router.back());
  await waitFor(() => expect(screen).toHavePathname('/quote/plan'));
  expect(screen.queryByTestId('quote-continue-spinner')).toBeNull();
  expect(screen.getByTestId('quote-continue')).toBeEnabled();
});
