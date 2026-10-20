import type { ZodType } from 'zod';
import {
  AccountSchema, BuildProfileSchema, BusinessProfileSchema, DEMO_CARD, QuoteContactSchema, SignUpSchema,
} from './schemas';

const issue = (s: ZodType, v: unknown) => s.safeParse(v).error?.issues[0]?.message;

const contact = { name: 'Renato Probst', addressId: 'a1', addressText: '1820 Maple Ridge Drive', apt: '', phone: '(512) 555-0147' };
test('quote contact', () => {
  expect(QuoteContactSchema.safeParse(contact).success).toBe(true);
  expect(issue(QuoteContactSchema, { ...contact, name: '' })).toBe('Enter your name');
  expect(issue(QuoteContactSchema, { ...contact, addressId: '' })).toBe('Pick an address from the list');
  expect(issue(QuoteContactSchema, { ...contact, phone: '555-0147' })).toBe('Enter a 10-digit phone number');
});
test('phones keep only digits', () => {
  expect(QuoteContactSchema.parse(contact).phone).toBe('5125550147');
});
test('account only accepts the demo card and needs the terms', () => {
  const ok = { firstName: 'Renato', lastName: 'Probst', email: 'renato@example.com', cardNumber: DEMO_CARD, cardExpiry: '12 / 34', cardCvc: '123', acceptTerms: true };
  expect(AccountSchema.safeParse(ok).success).toBe(true);
  expect(issue(AccountSchema, { ...ok, cardNumber: '4000 0000 0000 0002' })).toBe('Use the demo card 4242 4242 4242 4242');
  expect(issue(AccountSchema, { ...ok, acceptTerms: false })).toBe('Accept the Terms of Service');
  expect(issue(AccountSchema, { ...ok, email: 'nope' })).toBe('Enter a valid email');
});
test('sign up and profile forms', () => {
  expect(issue(SignUpSchema, { zip: '7870', email: 'a@b.co', phone: '5125550147', category: 'lawn' })).toBe('Enter a 5-digit zip code');
  expect(issue(BuildProfileSchema, { businessName: 'S', yearFounded: '2099', crewSize: 2 })).toBe('Enter a valid year');
  expect(issue(BusinessProfileSchema, { companyName: 'S', officePhone: '5125550147', businessAddress: 'x', bio: 'a'.repeat(251) })).toBe('250 characters max');
});
