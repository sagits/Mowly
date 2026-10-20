// Tests the quote form (C04-C06): prefill, address pick rules, validation.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';
import { renderApp } from './renderApp';

beforeEach(() => {
  useQuoteDraft.getState().reset();
  useQuoteDraft.getState().selectService('mowing');
});

test('prefilled, so Continue goes straight to sizing', async () => {
  await renderApp('/quote/details');
  expect(await screen.findByDisplayValue('Renato Probst')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('quote-continue'));
  await waitFor(() => expect(screen).toHavePathname('/quote/sizing'));
  expect(useQuoteDraft.getState().contact?.addressId).toBe('addr-maple-ridge');
});

test('typing after a pick blocks until a suggestion is picked again', async () => {
  await renderApp('/quote/details');
  await fireEvent.changeText(await screen.findByTestId('quote-address'), '1820 Maple');
  await fireEvent.press(screen.getByTestId('quote-continue'));
  expect(await screen.findByText('Pick an address from the list')).toBeTruthy();
  await fireEvent.press(await screen.findByTestId('address-option-addr-maple-ridge'));
  await fireEvent.press(screen.getByTestId('quote-continue'));
  await waitFor(() => expect(screen).toHavePathname('/quote/sizing'));
});

test('a short phone shows its error', async () => {
  await renderApp('/quote/details');
  await fireEvent.changeText(await screen.findByTestId('quote-phone'), '555');
  await fireEvent.press(screen.getByTestId('quote-continue'));
  expect(await screen.findByText('Enter a 10-digit phone number')).toBeTruthy();
});

test('the title names the service', async () => {
  await renderApp('/quote/details');
  expect(await screen.findByText("Let's get your Mowing quote")).toBeTruthy();
});
