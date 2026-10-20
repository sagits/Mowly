import { fireEvent } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import { useSession } from '@mowly/stores';
import { renderApp } from './renderApp';

test('the drawer navigates', async () => {
  await renderApp('/');
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('drawer-toggle'));
  await fireEvent.press(screen.getByTestId('drawer-calendar'));
  expect(await screen.findByTestId('screen-calendar')).toBeTruthy();
});

test('signed out goes to welcome', async () => {
  useSession.getState().signOut();
  await renderApp('/settings');
  expect(screen).toHavePathname('/welcome');
  useSession.getState().signIn();
});
