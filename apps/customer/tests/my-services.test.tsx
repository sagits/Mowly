// Tests the My Services tab (C19): booking list, empty state and opening a booking.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { configureMocks, resetDb } from '@mowly/mocks';
import { renderApp } from './renderApp';

test('lists the two seeded bookings in order and opens one', async () => {
  await renderApp('/services');
  expect(screen.getByTestId('services-loading')).toBeTruthy();
  await screen.findByTestId('booking-card-b-mowing');
  expect(screen.getAllByTestId(/^booking-card-/).map((n) => n.props.testID)).toEqual(['booking-card-b-mowing', 'booking-card-b-treatment']);
  expect(screen.getByTestId('booking-card-b-mowing')).toHaveTextContent(/Next service Sunday, October 25/);
  await fireEvent.press(screen.getByTestId('booking-card-b-mowing'));
  await waitFor(() => expect(screen).toHavePathname('/service/b-mowing'));
});

test('empty state', async () => {
  configureMocks({ seed: false });
  resetDb();
  try {
    await renderApp('/services');
    expect(await screen.findByTestId('services-empty')).toBeTruthy();
  } finally {
    configureMocks({ seed: true });
  }
});
