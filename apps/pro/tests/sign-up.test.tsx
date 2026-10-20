// Tests the sign up screen (P03, P04, P05).
import { act, fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useSession } from '@mowly/stores';
import { CORE_SKILLS } from '../src/content/coreSkills';
import { renderApp } from './renderApp';

test('category shows its core skills, and NEXT signs in', async () => {
  useSession.getState().signOut();
  await renderApp('/sign-up');
  await fireEvent.press(await screen.findByTestId('signup-category'));
  await fireEvent.press(screen.getByTestId('signup-category-option-lawn'));
  expect(screen.getByTestId('core-skills')).toHaveTextContent(new RegExp(`Core skills needed.*${CORE_SKILLS.lawn[0]}`));
  await fireEvent.changeText(screen.getByTestId('signup-zip'), '78704');
  await fireEvent.changeText(screen.getByTestId('signup-email'), 'mike@example.com');
  await fireEvent.changeText(screen.getByTestId('signup-phone'), '5125550147');
  await fireEvent.press(screen.getByTestId('signup-next'));
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();
  expect(useSession.getState().signedIn).toBe(true);

  await act(async () => {
    if (router.canGoBack()) router.back();
  });
  expect(screen.queryByTestId('screen-sign-up')).toBeNull();
  expect(screen.queryByTestId('welcome-signup')).toBeNull();
});

test('NEXT with an empty form shows errors and stays signed out', async () => {
  useSession.getState().signOut();
  await renderApp('/sign-up');
  await fireEvent.press(await screen.findByTestId('signup-next'));
  expect(await screen.findByTestId('signup-zip-error')).toBeTruthy();
  expect(useSession.getState().signedIn).toBe(false);
});
