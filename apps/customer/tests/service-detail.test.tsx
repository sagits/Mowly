// Tests the Service detail screen (C20) opened from a My Services card.
import { screen } from '@testing-library/react-native';
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
