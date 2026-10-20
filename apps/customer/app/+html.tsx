/** The web shell. A shell, literally: the document itself lives in `@mowly/features`. */
import { WebShell } from '@mowly/features';
import type { PropsWithChildren } from 'react';

/** Root HTML for the customer web build. */
export default function Root({ children }: PropsWithChildren) {
  return <WebShell title="Mowly">{children}</WebShell>;
}
