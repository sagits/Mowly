import { fireEvent } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import { renderApp } from './renderApp';

test('boots on Browse and switches tabs', async () => {
  await renderApp('/');
  expect(await screen.findByTestId('screen-browse')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('tab-services'));
  expect(await screen.findByTestId('screen-services')).toBeTruthy();
  expect(screen).toHavePathname('/services');
});
