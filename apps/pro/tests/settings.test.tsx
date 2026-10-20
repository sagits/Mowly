// Tests the Settings list, Business profile and Account info.
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { getPro } from '@mowly/mocks';
import { renderApp } from './renderApp';

test('business profile badge clears once complete', async () => {
  await renderApp('/settings');
  await waitFor(() => expect(screen.getByTestId('settings-business-profile')).toHaveTextContent(/1/));
  await fireEvent.press(screen.getByTestId('settings-business-profile'));
  await fireEvent.press(await screen.findByTestId('bp-photo'));
  await fireEvent.press(screen.getByTestId('avatar-0'));
  await fireEvent.press(screen.getByTestId('bp-truck'));
  await fireEvent.press(screen.getByTestId('avatar-1'));
  await fireEvent.changeText(screen.getByTestId('bp-office-phone'), '(512) 555-0100');
  await fireEvent.changeText(screen.getByTestId('bp-address'), '1820 Maple Ridge Drive, Austin, TX');
  await fireEvent.changeText(screen.getByTestId('bp-bio'), 'Family-run since 2012.');
  expect(screen.getByTestId('bp-bio-count')).toHaveTextContent('22/250');
  await fireEvent.press(screen.getByTestId('bp-save'));
  await waitFor(() => expect(screen).toHavePathname('/settings'));
  await waitFor(() => expect(screen.getByTestId('settings-business-profile')).not.toHaveTextContent(/1/));
  const pro = await getPro();
  expect(pro.bio).toBe('Family-run since 2012.');
  expect(pro.businessName).not.toBe('');
});

test('every row opens its screen', async () => {
  await renderApp('/settings');
  for (const slug of ['business-profile', 'account-info', 'damage-fee', 'tax-info', 'bank', 'billing', 'work-area', 'location', 'notifications', 'account']) {
    await fireEvent.press(await screen.findByTestId(`settings-${slug}`));
    await waitFor(() => expect(screen).toHavePathname(`/settings/${slug}`));
    await act(async () => router.back());
    await waitFor(() => expect(screen).toHavePathname('/settings'));
  }
});

test('account info validates the phone', async () => {
  await renderApp('/settings/account-info');
  await fireEvent.changeText(await screen.findByTestId('ai-phone'), '12');
  await fireEvent.press(screen.getByTestId('ai-save'));
  expect(await screen.findByText('Enter a 10-digit phone number')).toBeTruthy();
  expect(screen).toHavePathname('/settings/account-info');
});
