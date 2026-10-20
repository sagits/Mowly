// Deterministic lot size per address, and the price scaled from it.

/** The address whose price equals the catalog price. */
export const DEMO_ADDRESS_ID = 'addr-maple-ridge';

/** FNV-1a 32-bit hash of a string. */
export function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** Lot size in square feet for an address id, between 5000 and 11999. Same id, same size. */
export function lotSizeSqft(addressId: string): number {
  return 5000 + (hash(addressId) % 7000);
}

/** Scales a catalog price by lot size; the demo address gets exactly the catalog price. */
export function priceForLot(base: number, lotSqft: number): number {
  return Math.round((base * lotSqft) / lotSizeSqft(DEMO_ADDRESS_ID));
}
