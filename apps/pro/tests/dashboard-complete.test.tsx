// Tests the Dashboard once the checklist is finished (invented).
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { configureMocks, resetDb, updatePro } from '@mowly/mocks';
import { renderApp } from './renderApp';

const ALL_DONE = {
  businessName: 'Sullivan Lawn', yearFounded: '2018', skills: ['Lawn Mowing'], equipmentAnswered: true, workAreaSaved: true,
  gpsEnabled: true, damageFeeAccepted: true, bankLinked: true,
  taxInfo: { entityType: 'individual' as const, legalName: 'Mike Sullivan', dateOfBirth: '1985-04-12', legalAddress: '1820 Maple Ridge Drive' },
};

test('all done: the checklist collapses, the route and top 3 jobs show, the route card opens /route', async () => {
  await updatePro(ALL_DONE);
  await renderApp('/');
  expect(await screen.findByTestId('checklist-complete')).toHaveTextContent(/all set/);
  expect(screen.queryByTestId('checklist-bank-done')).toBeNull();
  expect(screen.getByText('Welcome, Mike')).toBeTruthy();
  expect(await screen.findAllByTestId(/^dash-job-/)).toHaveLength(3);
  expect(await screen.findByText(/3 stops/)).toBeTruthy();
  await fireEvent.press(screen.getByTestId('dash-route'));
  await waitFor(() => expect(screen).toHavePathname('/route'));
});

test('pressing a job opens Available Jobs', async () => {
  await updatePro(ALL_DONE);
  await renderApp('/');
  await fireEvent.press((await screen.findAllByTestId(/^dash-job-/))[0]!);
  await waitFor(() => expect(screen).toHavePathname('/jobs'));
});

test('7 of 8 done still shows the checklist', async () => {
  await updatePro({ ...ALL_DONE, bankLinked: false });
  await renderApp('/');
  expect(await screen.findByTestId('checklist-bank')).toBeTruthy();
  expect(screen.queryByTestId('checklist-complete')).toBeNull();
  expect(screen.queryByTestId('dash-route')).toBeNull();
});

test('an empty route shows an empty state', async () => {
  configureMocks({ seed: false });
  resetDb();
  try {
    await updatePro(ALL_DONE);
    await renderApp('/');
    expect(await screen.findByText('No jobs on your route today.')).toBeTruthy();
  } finally {
    configureMocks({ seed: true });
    resetDb();
  }
});
