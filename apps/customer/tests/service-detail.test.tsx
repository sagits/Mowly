// Tests the Service detail screen (C20) opened from a My Services card.
import { router } from 'expo-router';
import { act, screen } from '@testing-library/react-native';
import { setMockDelay } from '@mowly/mocks';
import { renderApp } from './renderApp';

test('shows the seeded mowing booking', async () => {
  await renderApp('/service/b-mowing');
  expect(await screen.findByText('$53.00 per service')).toBeTruthy();
  expect(screen.getByText('Greenleaf Lawn Co.')).toBeTruthy();
  expect(screen.getByText('Sunday, October 25 (Monthly)')).toBeTruthy();
  expect(screen.getByText('Scheduled')).toBeTruthy();
  expect(screen.getByText("What's included?")).toBeTruthy();
  for (const id of ['skip', 'reschedule', 'frequency', 'pause', 'cancel']) expect(screen.getByTestId(`detail-${id}`)).toBeTruthy();
});

test('an unknown booking id says the service was not found', async () => {
  await renderApp('/service/b-nope');
  expect(await screen.findByTestId('service-not-found')).toHaveTextContent("We couldn't find this service.");
});

test('Browse and Service detail show skeletons while they load', async () => {
  setMockDelay(200, 200);
  try {
    await renderApp('/');
    expect(screen.getByTestId('browse-loading')).toBeTruthy();
    expect(await screen.findByTestId('browse-service-mowing')).toBeTruthy();
    await act(async () => router.push('/service/b-mowing'));
    expect(screen.getByTestId('service-loading')).toBeTruthy();
    expect(await screen.findByText('$53.00 per service')).toBeTruthy();
  } finally {
    setMockDelay(0, 0);
  }
});
