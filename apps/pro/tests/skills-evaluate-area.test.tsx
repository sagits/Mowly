// Tests Add your skills, Evaluate your skills and Work area.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getPro, updatePro } from '@mowly/mocks';
import { renderApp } from './renderApp';

test('evaluate marks its row done and unlocks work area', async () => {
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('checklist-evaluate'));
  await fireEvent(await screen.findByTestId('equipment-mower'), 'valueChange', true);
  await fireEvent.press(screen.getByTestId('evaluate-save'));
  expect(await screen.findByTestId('checklist-evaluate-done')).toBeTruthy();
  expect(screen.getByTestId('checklist-work-area')).toBeEnabled();
  expect((await getPro()).equipment.mower).toBe(true);
});

test('work area saves its mode and returns to the dashboard', async () => {
  await updatePro({ equipmentAnswered: true });
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('checklist-work-area'));
  await fireEvent.press(await screen.findByTestId('work-area-by-day'));
  await fireEvent.press(screen.getByTestId('work-area-save'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  expect(await getPro()).toMatchObject({ workAreaMode: 'by-day', workAreaSaved: true });
});

test('settings list still shows after backing out of work area', async () => {
  await updatePro({ equipmentAnswered: true });
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('checklist-work-area'));
  await fireEvent.press(await screen.findByTestId('work-area-save'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  await fireEvent.press(screen.getByTestId('drawer-toggle'));
  await fireEvent.press(await screen.findByTestId('drawer-settings'));
  expect(await screen.findByTestId('screen-settings')).toBeTruthy();
  expect(screen).toHavePathname('/settings');
});

test('skills save', async () => {
  await renderApp('/');
  await fireEvent.press(await screen.findByTestId('drawer-toggle'));
  await fireEvent.press(await screen.findByTestId('drawer-skills'));
  await fireEvent(await screen.findByTestId('skill-cleanup'), 'valueChange', false);
  await fireEvent.press(screen.getByTestId('skills-save'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  expect((await getPro()).skills).toEqual(['Lawn Mowing', 'Leaf Removal']);
});

test('skills preselect from the pro and save is disabled with none', async () => {
  await renderApp('/skills');
  expect((await screen.findByTestId('skill-lawn-mowing')).props.value).toBe(true);
  for (const id of ['lawn-mowing', 'leaf-removal', 'cleanup']) await fireEvent(screen.getByTestId(`skill-${id}`), 'valueChange', false);
  expect(screen.getByTestId('skills-save')).toBeDisabled();
});
