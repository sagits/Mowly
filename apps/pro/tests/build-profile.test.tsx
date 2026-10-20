// Tests the Build a profile steps (P08, P09).
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { getPro } from '@mowly/mocks';
import { renderApp } from './renderApp';

async function openForm() {
  await renderApp('/');
  await act(async () => router.push('/profile' as never));
  await fireEvent.press(await screen.findByTestId('profile-intro-continue'));
}

test('saving the form updates the pro and returns to the dashboard', async () => {
  await openForm();
  await fireEvent.changeText(await screen.findByTestId('profile-business'), 'Sullivan Lawn & Garden');
  await fireEvent.changeText(screen.getByTestId('profile-year'), '2018');
  await fireEvent.changeText(screen.getByTestId('profile-crew'), '3');
  await fireEvent.press(screen.getByTestId('profile-headshot'));
  await fireEvent.press(screen.getByTestId('avatar-2'));
  await fireEvent.press(screen.getByTestId('profile-continue'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  expect(await getPro()).toMatchObject({ businessName: 'Sullivan Lawn & Garden', avatar: 2 });
});

test('a future year is rejected', async () => {
  await openForm();
  await fireEvent.changeText(await screen.findByTestId('profile-business'), 'Sullivan');
  await fireEvent.changeText(screen.getByTestId('profile-year'), '2099');
  await fireEvent.changeText(screen.getByTestId('profile-crew'), '3');
  await fireEvent.press(screen.getByTestId('profile-continue'));
  expect(await screen.findByText('Enter a valid year')).toBeTruthy();
  expect(screen).toHavePathname('/profile/form');
});
