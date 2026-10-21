// Tests Turn on your GPS and Accept damage fee.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getPro, updatePro } from '@mowly/mocks';
import { renderApp } from './renderApp';

test('accepting the damage fee marks the row done', async () => {
  await updatePro({ equipmentAnswered: true, workAreaSaved: true, gpsEnabled: true });
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('checklist-damage-fee'));
  expect(await screen.findByText(/charges a damage fee/)).toBeTruthy();
  await fireEvent.press(await screen.findByTestId('damage-fee-accept'));
  expect(await screen.findByTestId('checklist-damage-fee-done')).toBeTruthy();
  expect((await getPro()).damageFeeAccepted).toBe(true);
});

test('opted-in state from settings', async () => {
  await updatePro({ damageFeeAccepted: true });
  await renderApp('/settings/damage-fee');
  expect(await screen.findByText('You’re opted into Mowly’s damage fee policy.')).toBeTruthy();
  expect(screen.queryByTestId('damage-fee-accept')).toBeNull();
});

test('enable GPS', async () => {
  await updatePro({ equipmentAnswered: true, workAreaSaved: true });
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('checklist-gps'));
  await fireEvent.press(await screen.findByTestId('gps-faq-0-header'));
  expect(await screen.findByTestId('gps-faq-0-body')).toBeTruthy();
  expect(screen.getByTestId('gps-faq-2')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('gps-enable'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  expect((await getPro()).gpsEnabled).toBe(true);
});

test('GPS is on state replaces the button', async () => {
  await updatePro({ gpsEnabled: true });
  await renderApp('/settings/location');
  expect(await screen.findByText('GPS is on')).toBeTruthy();
  expect(screen.queryByTestId('gps-enable')).toBeNull();
});
