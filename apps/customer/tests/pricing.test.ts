// Tests the plan price helpers.
import { costPerService, formatPrice } from '../src/pricing';

test('promo takes five off and never goes negative', () => {
  expect(costPerService(57, false)).toBe(57);
  expect(costPerService(57, true)).toBe(52);
  expect(costPerService(3, true)).toBe(0);
});

test('prices show whole dollars, and cents only when there are some', () => {
  expect(formatPrice(57)).toBe('$57');
  expect(formatPrice(3.99)).toBe('$3.99');
});
