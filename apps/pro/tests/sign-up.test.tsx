// Tests the sign up screen (P03, P04, P05).
import { act, fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { getPro } from '@mowly/mocks';
import { useSession } from '@mowly/stores';
import { CORE_SKILLS } from '../src/content/coreSkills';
import { renderApp } from './renderApp';

const pick = async (value: 'lawn' | 'pool') => {
  await fireEvent.press(screen.getByTestId('signup-category'));
  await fireEvent.press(screen.getByTestId(`signup-category-option-${value}`));
};
const fill = async () => {
  await fireEvent.changeText(screen.getByTestId('signup-zip'), '78704');
  await fireEvent.changeText(screen.getByTestId('signup-email'), 'mike@example.com');
  await fireEvent.changeText(screen.getByTestId('signup-phone'), '5125550147');
};

test('category shows its core skills, and NEXT signs in', async () => {
  useSession.getState().signOut();
  await renderApp('/sign-up');
  await screen.findByTestId('signup-category');
  await pick('lawn');
  expect(screen.getByTestId('core-skills')).toHaveTextContent(new RegExp(`Core skills needed.*${CORE_SKILLS.lawn[0]}`));
  await fill();
  await fireEvent.press(screen.getByTestId('signup-next'));
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();
  expect(useSession.getState().signedIn).toBe(true);
  expect((await getPro()).category).toBe('lawn');

  // replace('/') dropped sign up and welcome from the history: there is nothing to go back to
  // (an unconditional back() would only log an unhandled GO_BACK warning).
  await act(async () => {});
  expect(router.canGoBack()).toBe(false);
  expect(screen.getByTestId('screen-dashboard')).toBeTruthy();
  expect(screen.queryByTestId('screen-sign-up')).toBeNull();
  expect(screen.queryByTestId('welcome-signup')).toBeNull();
});

test('picking pool saves pool', async () => {
  useSession.getState().signOut();
  await renderApp('/sign-up');
  await screen.findByTestId('signup-category');
  await pick('pool');
  await fill();
  await fireEvent.press(screen.getByTestId('signup-next'));
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();
  expect((await getPro()).category).toBe('pool');
});

test('switching category updates the core skills', async () => {
  useSession.getState().signOut();
  await renderApp('/sign-up');
  await screen.findByTestId('signup-category');
  await pick('lawn');
  await pick('pool');
  const text = screen.getByTestId('core-skills');
  expect(text).toHaveTextContent(new RegExp(`Core skills needed.*${CORE_SKILLS.pool[0]}`));
  expect(text).not.toHaveTextContent(CORE_SKILLS.lawn[0]!);
});

test('NEXT with an empty form shows every error and stays signed out', async () => {
  useSession.getState().signOut();
  await renderApp('/sign-up');
  await fireEvent.press(await screen.findByTestId('signup-next'));
  expect(await screen.findByTestId('signup-zip-error')).toHaveTextContent('Enter a 5-digit zip code');
  expect(screen.getByTestId('signup-email-error')).toHaveTextContent('Enter a valid email');
  expect(screen.getByTestId('signup-phone-error')).toHaveTextContent('Enter a 10-digit phone number');
  expect(screen.getByTestId('signup-category-error')).toHaveTextContent('Pick a category');
  expect(useSession.getState().signedIn).toBe(false);
});
