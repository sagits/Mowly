// Tests the checklist state derived from the Pro record.
import { getPro, updatePro } from '@mowly/mocks';
import { checklistDone, openSettingsCount, rowStates } from '../src/checklist';

test('seed: profile and skills done, evaluate next, the rest locked', async () => {
  const states = rowStates(checklistDone(await getPro()));
  expect(states).toEqual({ profile: 'done', skills: 'done', evaluate: 'next', 'work-area': 'locked', gps: 'locked', 'damage-fee': 'locked', tax: 'locked', bank: 'locked' });
});

test('open settings count', async () => {
  expect(openSettingsCount(await getPro())).toBe(6);
  await updatePro({ bankLinked: true });
  expect(openSettingsCount(await getPro())).toBe(5);
});
