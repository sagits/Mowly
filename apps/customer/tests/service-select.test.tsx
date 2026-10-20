// Tests the Service select screen (C01-C03) at the start of the quote funnel.
import { fireEvent, screen } from '@testing-library/react-native';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';
import { renderApp } from './renderApp';

beforeEach(() => useQuoteDraft.getState().reset());

test('Continue unlocks after picking a service and opens the quote form', async () => {
  await renderApp('/quote');
  await screen.findByTestId('service-tile-mowing');
  expect(screen.getAllByTestId(/^service-tile-/)).toHaveLength(11);
  expect(screen.getByTestId('quote-continue')).toBeDisabled();
  await fireEvent.press(screen.getByTestId('service-tile-mowing'));
  await fireEvent.press(screen.getByTestId('quote-continue'));
  expect(screen).toHavePathname('/quote/details');
  expect(useQuoteDraft.getState().serviceId).toBe('mowing');
});
