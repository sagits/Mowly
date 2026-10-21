// Zod schemas for every form. Error messages are the copy the screens show.
import { z } from 'zod';
import { today } from './dates';

/** The only card the demo accepts. */
export const DEMO_CARD = '4242 4242 4242 4242';

const digits = (s: string) => s.replace(/\D/g, '');
const required = (message: string) => z.string().trim().min(1, { error: message });
const email = z.email({ error: 'Enter a valid email' });
/** Keeps only digits and requires exactly 10. */
const phone = z.string().transform(digits).pipe(z.string().length(10, { error: 'Enter a 10-digit phone number' }));
const zip = z.string().regex(/^\d{5}$/, { error: 'Enter a 5-digit zip code' });

/** Contact step of the quote flow. */
export const QuoteContactSchema = z.object({
  name: required('Enter your name'),
  /** The picked suggestion's id; empty when the address was typed freely (saved as a new address on submit). */
  addressId: z.string(),
  addressText: required('Enter your address'),
  apt: z.string(),
  phone,
});
/** The validated values of the quote contact form. */
export type QuoteContactInput = z.infer<typeof QuoteContactSchema>;

/** Account creation with the demo card. */
export const AccountSchema = z.object({
  firstName: required('Enter your first name'),
  lastName: required('Enter your last name'),
  email,
  cardNumber: z.literal(DEMO_CARD, { error: `Use the demo card ${DEMO_CARD}` }),
  cardExpiry: z.string().regex(/^\d{2}\s*\/\s*\d{2}$/, { error: 'Enter the expiry as MM / YY' }),
  cardCvc: z.string().regex(/^\d{3}$/, { error: 'Enter the 3-digit code' }),
  acceptTerms: z.literal(true, { error: 'Accept the Terms of Service' }),
});
/** The validated values of the account form. */
export type AccountInput = z.infer<typeof AccountSchema>;

/** Pro sign in. */
export const SignInSchema = z.object({
  email,
  password: required('Enter your password'),
});
/** The validated values of the sign in form. */
export type SignInInput = z.infer<typeof SignInSchema>;

/** Pro sign up. */
export const SignUpSchema = z.object({
  zip,
  email,
  phone,
  category: z.enum(['lawn', 'pool'], { error: 'Pick a category' }),
});
/** The validated values of the sign up form. */
export type SignUpInput = z.infer<typeof SignUpSchema>;

/** First profile step of pro setup. */
export const BuildProfileSchema = z.object({
  businessName: required('Enter your business name'),
  yearFounded: z.string().refine((y) => /^\d{4}$/.test(y) && +y >= 1900 && +y <= +today().slice(0, 4), { error: 'Enter a valid year' }),
  crewSize: z.coerce.number({ error: 'Enter your crew size' }).int({ error: 'Enter your crew size' }).min(1, { error: 'Enter your crew size' }),
});
/** The validated values of the build profile form. */
export type BuildProfileInput = z.infer<typeof BuildProfileSchema>;

/** Business profile editor. */
export const BusinessProfileSchema = z.object({
  companyName: required('Enter your company name'),
  officePhone: phone,
  businessAddress: required('Enter your business address'),
  bio: z.string().max(250, { error: '250 characters max' }),
});
/** The validated values of the business profile form. */
export type BusinessProfileInput = z.infer<typeof BusinessProfileSchema>;

/** Account info editor. */
export const AccountInfoSchema = z.object({
  firstName: required('Enter your first name'),
  lastName: required('Enter your last name'),
  mobilePhone: phone,
  email,
});
/** The validated values of the account info form. */
export type AccountInfoInput = z.infer<typeof AccountInfoSchema>;

/** Tax info form. */
export const TaxInfoSchema = z.object({
  entityType: z.enum(['individual', 'llc', 'corporation'], { error: 'Pick an entity type' }),
  legalName: required('Enter your legal name'),
  dateOfBirth: required('Enter your date of birth'),
  legalAddress: required('Enter your legal address'),
});
/** The validated values of the tax info form. */
export type TaxInfoInput = z.infer<typeof TaxInfoSchema>;

/** Recommend-a-service form. */
export const RecommendSchema = z.object({
  price: z.coerce.number({ error: 'Enter a price' }).positive({ error: 'Enter a price' }),
  note: required('Add a short note'),
});
/** The validated values of the recommend form. */
export type RecommendInput = z.infer<typeof RecommendSchema>;
