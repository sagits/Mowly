// Tests the Route Map (P13): stops in order and a job claimed for today joining the end.
import { screen } from '@testing-library/react-native';
import { claimJob, getAvailableJobs } from '@mowly/mocks';
import { today } from '@mowly/types';
import { renderApp } from './renderApp';

test('three stops in order, and a job claimed today joins the end', async () => {
  await renderApp('/route');
  expect(await screen.findByTestId('route-stop-1')).toHaveTextContent(/from starting point/);
  expect(screen.getByTestId('route-stop-3')).toHaveTextContent(/from previous job/);
  expect(screen.getByTestId('route-pin-3')).toBeOnTheScreen();
  const job = (await getAvailableJobs(today()))[0]!;
  await claimJob(job.id, today());
  await renderApp('/route');
  expect(await screen.findByTestId('route-stop-4')).toHaveTextContent(job.address.line1, { exact: false });
  expect(screen.getByTestId('route-stop-4')).toHaveTextContent(/from previous job/);
  expect(screen.getByTestId('route-stop-1')).toHaveTextContent(/from starting point/);
});
