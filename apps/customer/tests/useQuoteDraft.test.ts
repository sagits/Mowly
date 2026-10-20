// Tests the quote draft store: service changes reset the plan, never the contact.
import { useQuoteDraft } from '../src/stores/useQuoteDraft';

const contact = { name: 'Ana', addressId: 'a1', addressText: '1 Main St', apt: '', phone: '5551234567' };

beforeEach(() => useQuoteDraft.getState().reset());

test('a different service clears the plan and promo but keeps the contact', () => {
  const s = useQuoteDraft.getState();
  s.selectService('mowing');
  s.setContact(contact);
  s.choosePlan('weekly');
  s.setStartDate('2026-10-22');
  s.applyPromo();
  s.selectService('leaf-removal');
  expect(useQuoteDraft.getState()).toMatchObject({
    serviceId: 'leaf-removal', frequency: null, startDate: null, promoApplied: false, contact,
  });
});

test('reselecting the same service keeps the plan', () => {
  const s = useQuoteDraft.getState();
  s.selectService('mowing');
  s.choosePlan('weekly');
  s.selectService('mowing');
  expect(useQuoteDraft.getState().frequency).toBe('weekly');
});
