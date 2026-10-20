// Tests the Dashboard checklist (P06).
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderApp } from './renderApp';

test('the next row opens its step, a locked row does nothing', async () => {
  await renderApp('/');
  expect(await screen.findByText('Welcome, Mike')).toBeTruthy();
  expect(screen.getByText('1291 customers served in Austin, TX')).toBeTruthy();
  expect(screen.getByTestId('checklist-profile-done')).toBeTruthy();
  fireEvent.press(screen.getByTestId('checklist-bank'));
  expect(screen).toHavePathname('/');
  fireEvent.press(screen.getByTestId('checklist-evaluate'));
  await waitFor(() => expect(screen).toHavePathname('/evaluate'));
});
