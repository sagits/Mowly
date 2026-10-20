// Tests Provide tax info and Connect your bank account.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getPro, updatePro } from '@mowly/mocks';
import { renderApp } from './renderApp';

test('tax info saves and never takes an SSN', async () => {
  await renderApp('/settings/tax-info');
  expect(await screen.findByTestId('tax-ssn')).toBeDisabled();
  expect(screen.getByText('Not collected in this demo')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('tax-entity'));
  await fireEvent.press(screen.getByTestId('tax-entity-option-individual'));
  await fireEvent.changeText(screen.getByTestId('tax-legal-name'), 'Mike Sullivan');
  await fireEvent.changeText(screen.getByTestId('tax-dob'), '04/12/1985');
  await fireEvent.changeText(screen.getByTestId('tax-address'), '1820 Maple Ridge Drive, Austin, TX 78704');
  await fireEvent.press(screen.getByTestId('tax-save'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  expect((await getPro()).taxInfo?.legalName).toBe('Mike Sullivan');
});

test('tax info shows errors for empty fields', async () => {
  await renderApp('/settings/tax-info');
  await fireEvent.press(await screen.findByTestId('tax-save'));
  expect(await screen.findByTestId('tax-legal-name-error')).toBeTruthy();
  expect((await getPro()).taxInfo).toBeNull();
});

test('linking the bank shows the demo account', async () => {
  await renderApp('/settings/bank');
  await fireEvent.press(await screen.findByTestId('bank-link'));
  expect(await screen.findByTestId('bank-linked')).toHaveTextContent('Demo Bank •••• 6789 linked');
  expect((await getPro()).bankLinked).toBe(true);
  expect(screen.queryByTestId('bank-done')).toBeNull();
});

test('from the checklist, CONTINUE returns to the dashboard', async () => {
  await updatePro({
    equipmentAnswered: true,
    workAreaSaved: true,
    gpsEnabled: true,
    damageFeeAccepted: true,
    taxInfo: { entityType: 'individual', legalName: 'Mike Sullivan', dateOfBirth: '04/12/1985', legalAddress: '1 Main St' },
  });
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('checklist-bank'));
  await fireEvent.press(await screen.findByTestId('bank-link'));
  await fireEvent.press(await screen.findByTestId('bank-done'));
  expect(await screen.findByTestId('checklist-complete')).toBeTruthy();
});
