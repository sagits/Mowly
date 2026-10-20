/** The web shell: the HTML document Expo Router wraps each statically exported page in. Never renders on a device. */
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
import { colors } from '@mowly/ui/tokens';

const bodyBackground = `body { background-color: ${colors.surface}; }`;
const interUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

/** Sets the title, viewport, noindex and Inter, resets the scroll view and paints the body before the bundle parses. */
export function WebShell({ children, title }: PropsWithChildren<{ title: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="noindex" />
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={interUrl} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: bodyBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
