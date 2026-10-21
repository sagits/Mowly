/** Pro-only form schemas. */
import { z } from 'zod';

/** Sign in: the PRD says any non-empty input signs in, so the email is not format-checked (the shared `SignInSchema` is). */
export const ProSignInSchema = z.object({
  email: z.string().trim().min(1, { error: 'Enter your email' }),
  password: z.string().trim().min(1, { error: 'Enter your password' }),
});
