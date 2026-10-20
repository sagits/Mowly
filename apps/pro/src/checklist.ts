/** The onboarding checklist: its rows and the state derived from the Pro record (no separate store). */
import type { Href } from 'expo-router';
import type { ChecklistItemId, Pro } from '@mowly/types';

export type ChecklistItem = { id: ChecklistItemId; label: string; group: 'profile' | 'paid'; href: Href };

export const CHECKLIST: ChecklistItem[] = [
  { id: 'profile', label: 'Build a profile', group: 'profile', href: '/profile' },
  { id: 'skills', label: 'Add your skills', group: 'profile', href: '/skills' },
  { id: 'evaluate', label: 'Evaluate your skills', group: 'profile', href: '/evaluate' },
  { id: 'work-area', label: 'Add your work area', group: 'profile', href: '/settings/work-area' },
  { id: 'gps', label: 'Turn on your GPS', group: 'paid', href: '/settings/location' },
  { id: 'damage-fee', label: 'Accept damage fee', group: 'paid', href: '/settings/damage-fee' },
  { id: 'tax', label: 'Provide tax info', group: 'paid', href: '/settings/tax-info' },
  { id: 'bank', label: 'Connect your bank account', group: 'paid', href: '/settings/bank?from=checklist' },
];

/** Which rows are finished, read from the Pro record. */
export function checklistDone(pro: Pro): Record<ChecklistItemId, boolean> {
  return {
    profile: Boolean(pro.businessName && pro.yearFounded),
    skills: pro.skills.length > 0,
    evaluate: pro.equipmentAnswered,
    'work-area': pro.workAreaSaved,
    gps: pro.gpsEnabled,
    'damage-fee': pro.damageFeeAccepted,
    tax: pro.taxInfo !== null,
    bank: pro.bankLinked,
  };
}

/** Done rows are done, the first open row is next, later open rows are locked. */
export function rowStates(done: Record<ChecklistItemId, boolean>): Record<ChecklistItemId, 'done' | 'next' | 'locked'> {
  let nextTaken = false;
  const out = {} as Record<ChecklistItemId, 'done' | 'next' | 'locked'>;
  for (const { id } of CHECKLIST) {
    if (done[id]) out[id] = 'done';
    else if (!nextTaken) { out[id] = 'next'; nextTaken = true; }
    else out[id] = 'locked';
  }
  return out;
}

/** Whether the business profile (bio and both photos) is filled in. */
export function businessProfileComplete(pro: Pro): boolean {
  return pro.bio !== '' && pro.avatar !== null && pro.truckPhoto !== null;
}

/** The Settings badge: the incomplete business profile plus the open setup steps. */
export function openSettingsCount(pro: Pro): number {
  const done = checklistDone(pro);
  const open = (['work-area', 'gps', 'damage-fee', 'tax', 'bank'] as const).filter((id) => !done[id]).length;
  return (businessProfileComplete(pro) ? 0 : 1) + open;
}
