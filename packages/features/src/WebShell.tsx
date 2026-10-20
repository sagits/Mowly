/** The web shell: the HTML document Expo Router wraps each statically exported page in. Never renders on a device. */
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
import { colors } from '@mowly/ui/tokens';

const bodyBackground = `body { background-color: ${colors.surface}; }`;

/** Sets the viewport, resets the scroll view and paints the body before the bundle parses. */
export function WebShell({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: bodyBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
