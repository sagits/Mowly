// Tests leaving and re-entering the quote funnel: the close X, empty-draft redirects, "not looking" and going back.
import { router } from 'expo-router';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';
import { renderApp } from './renderApp';

const CONTACT = { name: 'Jane Doe', addressId: 'addr-maple-ridge', addressText: '1820 Maple Ridge Drive, Austin, TX 78704', apt: '', phone: '5125550147' };

beforeEach(() => useQuoteDraft.getState().reset());

/** From service select: pick `tile`, submit the form, and stand in for the sizing timer (its own test covers it). */
async function toPlan(tile: string, prefilledName?: string) {
  await fireEvent.press(await screen.findByTestId(`service-tile-${tile}`));
  await fireEvent.press(screen.getByTestId('quote-continue'));
  await screen.findByTestId('quote-name');
  if (prefilledName) expect(screen.getByTestId('quote-name')).toHaveDisplayValue(prefilledName);
  await fireEvent.press(screen.getByTestId('quote-continue'));
  await waitFor(() => expect(screen).toHavePathname('/quote/sizing'));
  await act(async () => router.replace('/quote/plan'));
  await waitFor(() => expect(screen.getByTestId('cost-per-service')).not.toHaveTextContent('$0'));
}

test('the X leaves the funnel back to Browse and keeps the draft', async () => {
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('browse-view-price-leaf-removal'));
  await screen.findByTestId('quote-name');
  await fireEvent.press(screen.getByTestId('funnel-close'));
  expect(await screen.findByTestId('screen-browse')).toBeTruthy();
  expect(screen).toHavePathname('/');
  expect(useQuoteDraft.getState().serviceId).toBe('leaf-removal');
});

test('with nothing under the funnel (deep link), the X replaces to Browse', async () => {
  useQuoteDraft.getState().selectService('mowing');
  await renderApp('/quote/details');
  await fireEvent.press(await screen.findByTestId('funnel-close'));
  await waitFor(() => expect(screen).toHavePathname('/'));
});

test('an empty draft sends the plan step back to service select', async () => {
  await renderApp('/quote/plan');
  await waitFor(() => expect(screen).toHavePathname('/quote'));
});

test('the account step without a plan goes to the plan step', async () => {
  useQuoteDraft.getState().selectService('mowing');
  useQuoteDraft.getState().setContact(CONTACT);
  await renderApp('/quote/account');
  await waitFor(() => expect(screen).toHavePathname('/quote/plan'));
});

test('a confirmation with no booking in the draft shows My Services', async () => {
  await renderApp('/quote/booked');
  await waitFor(() => expect(screen).toHavePathname('/services'));
});

test('"not looking" returns to service select without leaving the old form underneath', async () => {
  useQuoteDraft.getState().setContact(CONTACT);
  await renderApp('/quote');
  await toPlan('mowing');
  await fireEvent.press(screen.getByTestId('plan-not-looking'));
  await waitFor(() => expect(screen).toHavePathname('/quote'));
  expect(router.canDismiss()).toBe(false);
});

test('going back to another service resets plan and promo, keeps the contact', async () => {
  useQuoteDraft.getState().setContact(CONTACT);
  await renderApp('/quote');
  await toPlan('mowing');
  await fireEvent.press(screen.getByTestId('plan-row-weekly'));
  await fireEvent.press(screen.getByTestId('promo-open'));
  await fireEvent.changeText(await screen.findByTestId('promo-input'), 'SPRING');
  await fireEvent.press(screen.getByTestId('promo-apply'));
  await waitFor(() => expect(screen.getByTestId('cost-per-service')).toHaveTextContent('$52'));

  await fireEvent.press(screen.getByTestId('plan-not-looking'));
  await waitFor(() => expect(screen).toHavePathname('/quote'));
  await toPlan('leaf-removal', 'Jane Doe');
  expect(screen.getByTestId('cost-per-service')).toHaveTextContent('$129');
  expect(useQuoteDraft.getState().frequency).toBe('one-time');
  expect(screen.queryByTestId('promo-applied')).toBeNull();
  expect(useQuoteDraft.getState().contact?.name).toBe('Jane Doe');
});
