// Tests the quote form (C04-C06): prefill, typed or picked addresses, validation, address-only mode.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getCustomer } from '@mowly/mocks';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';
import { renderApp } from './renderApp';

beforeEach(() => {
  useQuoteDraft.getState().clear();
  useQuoteDraft.getState().selectService('mowing');
});

test('prefilled, so Continue goes straight to sizing', async () => {
  await renderApp('/quote/details');
  expect(await screen.findByDisplayValue('Renato Probst')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('quote-continue'));
  await waitFor(() => expect(screen).toHavePathname('/quote/sizing'));
  expect(useQuoteDraft.getState().contact?.addressId).toBe('addr-maple-ridge');
});

test('any typed address is accepted and becomes the customer address', async () => {
  await renderApp('/quote/details');
  await fireEvent.changeText(await screen.findByTestId('quote-address'), '1500 Zilker Street, Austin, TX 78701');
  await fireEvent.press(screen.getByTestId('quote-continue'));
  await waitFor(() => expect(screen).toHavePathname('/quote/sizing'));
  const id = useQuoteDraft.getState().contact?.addressId;
  expect(id).toMatch(/^a-/);
  expect((await getCustomer()).address.id).toBe(id);
});

test('picking a suggestion keeps its address id', async () => {
  await renderApp('/quote/details');
  await fireEvent.changeText(await screen.findByTestId('quote-address'), 'Oak Hollow');
  await fireEvent.press(await screen.findByTestId('address-option-addr-oak-hollow'));
  await fireEvent.press(screen.getByTestId('quote-continue'));
  await waitFor(() => expect(screen).toHavePathname('/quote/sizing'));
  expect(useQuoteDraft.getState().contact?.addressId).toBe('addr-oak-hollow');
});

test('the x empties the address, and an empty address shows its error', async () => {
  await renderApp('/quote/details');
  await fireEvent.press(await screen.findByTestId('quote-address-clear'));
  expect(screen.getByTestId('quote-address')).toHaveDisplayValue('');
  await fireEvent.press(screen.getByTestId('quote-continue'));
  expect(await screen.findByText('Enter your address')).toBeTruthy();
});

test('Add address on Browse opens the form alone, and Continue saves and returns to Browse', async () => {
  useQuoteDraft.getState().clear();
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('address-switcher'));
  await fireEvent.press(await screen.findByTestId('address-switcher-add'));
  expect(await screen.findByText('Update your details')).toBeTruthy();
  await fireEvent.changeText(screen.getByTestId('quote-address'), '1500 Zilker Street, Austin, TX 78701');
  await fireEvent.press(screen.getByTestId('quote-continue'));
  expect(await screen.findByTestId('screen-browse')).toBeTruthy();
  expect(await screen.findByText('1500 Zilker Street')).toBeTruthy();
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
