// Tests the Browse tab (C18): recommendations, services to explore, the address switcher and the quote shortcuts.
import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { renderApp } from './renderApp';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';

test('View price skips service select with the service chosen', async () => {
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('browse-view-price-leaf-removal'));
  await waitFor(() => expect(screen).toHavePathname('/quote/details'));
  expect(useQuoteDraft.getState().serviceId).toBe('leaf-removal');
});

test('GET A QUOTE on a recommended card does the same', async () => {
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('browse-reco-lawn-treatment-quote'));
  await waitFor(() => expect(screen).toHavePathname('/quote/details'));
  expect(useQuoteDraft.getState().serviceId).toBe('lawn-treatment');
});

test('three recommended cards, all 11 services and the address switcher', async () => {
  await renderApp('/');
  expect(await screen.findAllByTestId(/^browse-reco-(?!.*-quote$)/)).toHaveLength(3);
  expect(await screen.findAllByTestId(/^browse-service-[a-z-]+$/)).toHaveLength(11);
  await fireEvent.press(screen.getByTestId('address-switcher'));
  // The header shows the address too, so look inside the sheet.
  const sheet = within(await screen.findByTestId('address-switcher-sheet'));
  expect(sheet.getByText('1820 Maple Ridge Drive')).toBeTruthy();
  expect(sheet.getByText('Add address')).toBeTruthy();
});
