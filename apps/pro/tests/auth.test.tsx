// Tests sign out, the welcome screen and sign in.
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useSession } from '@mowly/stores';
import { renderApp } from './renderApp';

test('sign out lands on welcome and cannot go back in', async () => {
  await renderApp('/settings');
  await fireEvent.press(await screen.findByTestId('settings-sign-out'));
  await fireEvent.press(await screen.findByTestId('sign-out-confirm'));
  await waitFor(() => expect(screen).toHavePathname('/welcome'));
  expect(useSession.getState().signedIn).toBe(false);

  await act(async () => {
    router.push('/settings');
  });
  expect(screen).toHavePathname('/welcome');
  expect(useSession.getState().signedIn).toBe(false);

  // Back must not reveal the signed-in stack either.
  await act(async () => {
    if (router.canGoBack()) router.back();
  });
  expect(screen).toHavePathname('/welcome');
  expect(screen.queryByTestId('screen-settings')).toBeNull();
  expect(screen.queryByTestId('screen-dashboard')).toBeNull();
});

test('cancel keeps the session', async () => {
  await renderApp('/settings');
  await fireEvent.press(await screen.findByTestId('settings-sign-out'));
  await fireEvent.press(await screen.findByTestId('sign-out-cancel'));
  expect(screen).toHavePathname('/settings');
  expect(useSession.getState().signedIn).toBe(true);
});

test('welcome shows three slides', async () => {
  useSession.getState().signOut();
  await renderApp('/welcome');
  for (const i of [0, 1, 2]) expect(await screen.findByTestId(`welcome-slide-${i}`)).toBeTruthy();
});

test('log in with anything returns to the dashboard', async () => {
  useSession.getState().signOut();
  await renderApp('/welcome');
  await fireEvent.press(await screen.findByTestId('welcome-login'));
  await fireEvent.changeText(await screen.findByTestId('signin-email'), 'x@y.com');
  await fireEvent.changeText(screen.getByTestId('signin-password'), 'x');
  await fireEvent.press(screen.getByTestId('signin-submit'));
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();
});

test('empty sign in shows errors', async () => {
  useSession.getState().signOut();
  await renderApp('/sign-in');
  await fireEvent.press(await screen.findByTestId('signin-submit'));
  expect(await screen.findByTestId('signin-email-error')).toBeTruthy();
  expect(await screen.findByTestId('signin-password-error')).toBeTruthy();
  expect(screen).toHavePathname('/sign-in');
  expect(useSession.getState().signedIn).toBe(false);
});

test('welcome sign up opens the sign up form', async () => {
  useSession.getState().signOut();
  await renderApp('/welcome');
  await fireEvent.press(await screen.findByTestId('welcome-signup'));
  expect(await screen.findByTestId('screen-sign-up')).toBeTruthy();
});

test('after sign out and sign in, back cannot return to welcome or sign in', async () => {
  await renderApp('/settings');
  await fireEvent.press(await screen.findByTestId('settings-sign-out'));
  await fireEvent.press(await screen.findByTestId('sign-out-confirm'));
  await fireEvent.press(await screen.findByTestId('welcome-login'));
  await fireEvent.changeText(await screen.findByTestId('signin-email'), 'x@y.com');
  await fireEvent.changeText(screen.getByTestId('signin-password'), 'x');
  await fireEvent.press(screen.getByTestId('signin-submit'));
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();

  await act(async () => {
    if (router.canGoBack()) router.back();
  });
  expect(screen).toHavePathname('/');
  expect(screen.queryByTestId('screen-welcome')).toBeNull();
  expect(screen.queryByTestId('screen-sign-in')).toBeNull();
});

test('a signed-in deep link to welcome lands in the app', async () => {
  await renderApp('/welcome');
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();
  expect(screen.queryByTestId('screen-welcome')).toBeNull();
});
