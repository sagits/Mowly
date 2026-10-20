/** Funnel pricing rules: the promo discount and the Trust & Safety fee. */

/** Dollars a promo code takes off each service. */
export const PROMO_DISCOUNT = 5;
/** Flat fee shown under the price. */
export const TRUST_FEE = 3.99;

/** Price per service after the promo, never below zero. */
export function costPerService(price: number, promoApplied: boolean): number {
  return Math.max(0, price - (promoApplied ? PROMO_DISCOUNT : 0));
}
