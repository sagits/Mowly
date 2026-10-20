// Tests the invented drawer screens: Crews, Customer Search, Performance, Inbox.
import { fireEvent, screen } from '@testing-library/react-native';
import { getDb } from '@mowly/mocks';
import { renderApp } from './renderApp';

test('customer search filters claimed jobs by customer name', async () => {
  getDb().jobs.find((j) => j.id === 'job-12')!.customerName = 'Tom Reyes';
  await renderApp('/customers');
  expect(await screen.findByTestId('customer-job-11')).toBeTruthy();
  expect(screen.getByTestId('customer-job-12')).toBeTruthy();
  await fireEvent.changeText(screen.getByTestId('customers-search'), 'a');
  expect(screen.getByTestId('customer-job-11')).toBeTruthy();
  expect(screen.queryByTestId('customer-job-12')).toBeNull();
});
test('crews lists the crew', async () => {
  await renderApp('/crews');
  expect(await screen.findByTestId('crew-crew-mike')).toBeTruthy();
  expect(screen.getByTestId('crew-crew-dan')).toBeTruthy();
});
test('performance lists three stats', async () => {
  await renderApp('/performance');
  expect(await screen.findByTestId('stat-0')).toBeTruthy();
  expect(screen.getByTestId('stat-2')).toBeTruthy();
});
test('inbox lists the customer threads', async () => {
  await renderApp('/inbox');
  expect(await screen.findByTestId('pro-thread-pt-renato')).toBeTruthy();
  expect(screen.getByTestId('pro-thread-pt-jane')).toBeTruthy();
});
