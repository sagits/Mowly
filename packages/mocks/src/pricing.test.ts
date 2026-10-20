import { DEMO_ADDRESS_ID, getQuote, lotSizeSqft } from './index';

test('lot size is stable and in range', () => {
  expect(lotSizeSqft('addr-x')).toBe(lotSizeSqft('addr-x'));
  for (const id of ['a', 'b', 'addr-maple-ridge']) expect(lotSizeSqft(id)).toBeGreaterThanOrEqual(5000);
});
test('the demo address gets the catalog price', async () => {
  const { plans } = await getQuote('mowing', DEMO_ADDRESS_ID);
  expect(plans).toEqual([
    { frequency: 'weekly', price: 57, recommended: true },
    { frequency: 'every-2-weeks', price: 60, recommended: false },
    { frequency: 'monthly', price: 60, recommended: false },
  ]);
});
