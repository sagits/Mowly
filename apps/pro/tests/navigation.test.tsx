// Tests the signed-in navigation: steps pushed above the drawer go back to whoever opened them.
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { getPro, updatePro } from '@mowly/mocks';
import { useSession } from '@mowly/stores';
import { renderApp } from './renderApp';

test('a step opened after another one goes back to the dashboard, not to the stale step', async () => {
  await updatePro({ equipmentAnswered: true });
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('checklist-work-area'));
  await fireEvent.press(await screen.findByTestId('work-area-save'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  expect(await screen.findByTestId('checklist-work-area-done')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('checklist-gps'));
  await fireEvent.press(await screen.findByTestId('gps-enable'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();
  expect((await getPro()).gpsEnabled).toBe(true);
});

test('work area opened from settings goes back to the settings list', async () => {
  await renderApp('/settings');
  await act(async () => router.push('/settings/work-area'));
  await fireEvent.press(await screen.findByTestId('work-area-save'));
  await waitFor(() => expect(screen).toHavePathname('/settings'));
  expect(await screen.findByTestId('screen-settings')).toBeTruthy();
});

test('GPS opened from settings goes back to the settings list', async () => {
  await renderApp('/settings');
  await act(async () => router.push('/settings/location'));
  await fireEvent.press(await screen.findByTestId('gps-enable'));
  await waitFor(() => expect(screen).toHavePathname('/settings'));
  expect(await screen.findByTestId('screen-settings')).toBeTruthy();
});

test('the hamburger opens the drawer from the settings list', async () => {
  await renderApp('/settings');
  await fireEvent.press(await screen.findByTestId('drawer-toggle'));
  expect(await screen.findByTestId('drawer-dashboard')).toBeTruthy();
});

test('a step opened directly (deep link, web refresh) has the dashboard underneath', async () => {
  await renderApp('/settings/location');
  await fireEvent.press(await screen.findByTestId('gps-enable'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();
});

test('signing out on a pushed step redirects to welcome', async () => {
  await renderApp('/settings/work-area');
  expect(await screen.findByTestId('screen-work-area')).toBeTruthy();
  try {
    await act(async () => useSession.getState().signOut());
    await waitFor(() => expect(screen).toHavePathname('/welcome'));
    expect(screen.queryByTestId('screen-work-area')).toBeNull();
  } finally {
    useSession.getState().signIn();
  }
});
