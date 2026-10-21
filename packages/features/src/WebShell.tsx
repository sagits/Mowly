/** The web shell: the HTML document Expo Router wraps each statically exported page in. Never renders on a device. */
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
import { colors } from '@mowly/ui/tokens';

// Inside the desktop PhoneFrame iframe, scrollbars hide like on a phone; the inline script tags the page before it paints.
const shellStyles = `body { background-color: ${colors.surface}; }
html.framed * { scrollbar-width: none; }
html.framed *::-webkit-scrollbar { display: none; }`;
const markFramed = `if (window.self !== window.top) document.documentElement.classList.add('framed');`;
// The green M, inline so the page makes no favicon request.
const favicon = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${colors.primary}"/><path d="M8 23V9l8 9 8-9v14" fill="none" stroke="${colors.surface}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
)}`;
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
        <link rel="icon" href={favicon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={interUrl} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: shellStyles }} />
        <script dangerouslySetInnerHTML={{ __html: markFramed }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
