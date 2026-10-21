// Tests the invented drawer screens: Crews, Customer Search, Performance, Inbox.
import { fireEvent, screen } from '@testing-library/react-native';
import { renderApp } from './renderApp';

test('customer search filters claimed jobs by customer name', async () => {
  await renderApp('/customers');
  expect(await screen.findByTestId('customer-job-11')).toBeTruthy();
  await fireEvent.changeText(screen.getByTestId('customers-search'), 'jane');
  expect(screen.getByTestId('customer-job-12')).toBeTruthy();
  expect(screen.queryByTestId('customer-job-11')).toBeNull();
  expect(screen.queryByTestId('customer-job-13')).toBeNull();
});
test('customer search with no match shows no rows', async () => {
  await renderApp('/customers');
  expect(await screen.findByTestId('customer-job-11')).toBeTruthy();
  await fireEvent.changeText(screen.getByTestId('customers-search'), 'zzz');
  expect(screen.queryAllByTestId(/^customer-/)).toHaveLength(0);
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
