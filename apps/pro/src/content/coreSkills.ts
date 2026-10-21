/** Core skills per category, transcribed from P05 (lawn) and its pool equivalent. */
import type { Pro } from '@mowly/types';

export const CORE_SKILLS: Record<Pro['category'], string[]> = {
  lawn: ['Cleanup', 'Lawn Mowing', 'Leaf Removal', 'Weed Pulling', 'Weeding'],
  pool: ['Deep Pool Cleaning', 'Pool Cleaning', 'Pool Open & Close'],
};

export const CATEGORY_LABEL: Record<Pro['category'], string> = { lawn: 'Basic Lawn Care', pool: 'Basic Pool Care' };

/** `Lawn Mowing` -> `lawn-mowing`, for testIDs. */
export const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
