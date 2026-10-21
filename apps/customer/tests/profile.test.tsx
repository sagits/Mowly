// Tests the Profile tab: identity block and Reset demo.
import { fireEvent, screen } from '@testing-library/react-native';
import { createBooking, getBookings } from '@mowly/mocks';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';
import { renderApp } from './renderApp';

test('reset demo brings back the seed', async () => {
  await createBooking({ serviceId: 'flower-bed-weeding', frequency: 'one-time', price: 79, startDate: '2026-10-21', addressId: 'addr-maple-ridge' });
  useQuoteDraft.getState().selectService('mowing');
  await renderApp('/profile');
  expect(await screen.findByText('Renato Probst')).toBeTruthy();
  await fireEvent.press(await screen.findByTestId('profile-reset'));
  await fireEvent.press(screen.getByTestId('reset-confirm'));
  expect(await screen.findByText('Demo reset')).toBeTruthy();
  expect(await getBookings()).toHaveLength(2);
  expect(useQuoteDraft.getState().serviceId).toBeNull();
});

test('inert rows say they are not in the demo', async () => {
  await renderApp('/profile');
  expect(await screen.findByText('Demo card •••• 4242')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('profile-help'));
  expect(await screen.findByText('Not in this demo')).toBeTruthy();
});
