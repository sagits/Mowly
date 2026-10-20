// Tests the Service detail management sheets: skip, reschedule, frequency, pause, cancel.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderApp } from './renderApp';

test('skip moves the date by the frequency', async () => {
  await renderApp('/service/b-mowing');
  await fireEvent.press(await screen.findByTestId('detail-skip'));
  await fireEvent.press(screen.getByTestId('skip-confirm'));
  expect(await screen.findByText('Tuesday, November 24 (Monthly)')).toBeTruthy();
});

test('cancel removes it from My Services', async () => {
  await renderApp('/services');
  await fireEvent.press(await screen.findByTestId('booking-card-b-mowing'));
  await fireEvent.press(await screen.findByTestId('detail-cancel'));
  await fireEvent.press(screen.getByTestId('cancel-confirm'));
  await waitFor(() => expect(screen).toHavePathname('/services'));
  await waitFor(() => expect(screen.queryByTestId('booking-card-b-mowing')).toBeNull());
});

test('pause shows Paused until the month', async () => {
  await renderApp('/service/b-mowing');
  await fireEvent.press(await screen.findByTestId('detail-pause'));
  expect(screen.getByTestId('pause-month-2026-11')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('pause-month-2026-12'));
  expect(await screen.findByText('Paused until December')).toBeTruthy();
});

test('change frequency updates the label', async () => {
  await renderApp('/service/b-mowing');
  await fireEvent.press(await screen.findByTestId('detail-frequency'));
  await fireEvent.press(await screen.findByTestId('frequency-every-2-weeks'));
  await fireEvent.press(screen.getByTestId('frequency-save'));
  expect(await screen.findByText(/Every 2 Weeks/)).toBeTruthy();
});

test('reschedule picks a date', async () => {
  await renderApp('/service/b-mowing');
  await fireEvent.press(await screen.findByTestId('detail-reschedule'));
  await fireEvent.press(screen.getByTestId('date-option-2026-10-28'));
  expect(await screen.findByText(/Wednesday, October 28/)).toBeTruthy();
});
