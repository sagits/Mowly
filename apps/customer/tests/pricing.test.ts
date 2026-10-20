// Tests the plan price helpers.
import { costPerService } from '../src/pricing';

test('promo takes five off and never goes negative', () => {
  expect(costPerService(57, false)).toBe(57);
  expect(costPerService(57, true)).toBe(52);
  expect(costPerService(3, true)).toBe(0);
});
