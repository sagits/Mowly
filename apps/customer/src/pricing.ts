/** Funnel pricing rules: the promo discount and the Trust & Safety fee. */
import { formatMoney } from '@mowly/types';

/** Dollars a promo code takes off each service. */
export const PROMO_DISCOUNT = 5;
/** Flat fee shown under the price. */
export const TRUST_FEE = 3.99;

/** Price per service after the promo, never below zero. */
export function costPerService(price: number, promoApplied: boolean): number {
  return Math.max(0, price - (promoApplied ? PROMO_DISCOUNT : 0));
}

/** Funnel price label: whole dollars as in C09 ("$57"), cents only when there are some ("$12.50"). */
export function formatPrice(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : formatMoney(amount);
}
