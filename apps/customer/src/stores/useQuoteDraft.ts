/**
 * The quote funnel's in-progress answers. A booking resets the quote but keeps the contact details, so the next
 * quote skips the form; only the demo reset clears them.
 */
import { create } from 'zustand';
import type { Frequency, IsoDate, QuoteContactInput, ServiceId } from '@mowly/types';

/** The draft values and their transitions. */
export type QuoteDraft = {
  serviceId: ServiceId | null;
  contact: QuoteContactInput | null;
  frequency: Frequency | null;
  startDate: IsoDate | null;
  promoApplied: boolean;
  /** A different id clears frequency, startDate and promoApplied; contact stays. */
  selectService(id: ServiceId): void;
  setContact(contact: QuoteContactInput): void;
  choosePlan(frequency: Frequency): void;
  setStartDate(date: IsoDate): void;
  applyPromo(): void;
  /** Clears the quote (service, plan, promo); the contact details stay. */
  reset(): void;
  /** Clears everything, contact details included. */
  clear(): void;
};

const EMPTY = { serviceId: null, contact: null, frequency: null, startDate: null, promoApplied: false };

/** Hook over the draft store; also `useQuoteDraft.getState()` outside React. */
export const useQuoteDraft = create<QuoteDraft>((set) => ({
  ...EMPTY,
  selectService: (id) =>
    set((s) => (s.serviceId === id ? s : { serviceId: id, frequency: null, startDate: null, promoApplied: false })),
  setContact: (contact) => set({ contact }),
  choosePlan: (frequency) => set({ frequency }),
  setStartDate: (startDate) => set({ startDate }),
  applyPromo: () => set({ promoApplied: true }),
  reset: () => set((s) => ({ ...EMPTY, contact: s.contact })),
  clear: () => set(EMPTY),
}));

/** A funnel step and what it needs from the earlier steps. */
export type FunnelStep = 'details' | 'plan' | 'account';

/**
 * Where `step` must send the user when the draft lacks what the earlier steps collect (after a web reload
 * or a deep link the draft is empty), or `null` when the step can render.
 */
export function missingStep(draft: Pick<QuoteDraft, 'serviceId' | 'contact' | 'frequency' | 'startDate'>, step: FunnelStep) {
  if (!draft.serviceId) return '/quote' as const;
  if (step === 'details') return null;
  if (!draft.contact) return '/quote/details' as const;
  if (step === 'plan') return null;
  return draft.frequency && draft.startDate ? null : ('/quote/plan' as const);
}

/** Where the funnel goes once a service is chosen: the plan when the contact details are already known, else the form. */
export function afterService(draft: Pick<QuoteDraft, 'contact'>) {
  return draft.contact ? ('/quote/plan' as const) : ('/quote/details' as const);
}
