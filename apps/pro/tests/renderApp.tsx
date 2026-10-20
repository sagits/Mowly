/** Test helper: renders the pro app's routes at a URL. */
import { screen } from '@testing-library/react-native';
import path from 'path';
import { renderRouter } from 'expo-router/testing-library';

/**
 * Mounts the real `app/` route tree from `initialUrl` (default Dashboard). RNTL 14's `render` is async, so
 * `renderRouter` attaches its `getPathname` helpers to the pending promise; copy them onto `screen`
 * so `expect(screen).toHavePathname(...)` works.
 */
export async function renderApp(initialUrl = '/') {
  const pending = renderRouter(path.resolve(__dirname, '../app'), { initialUrl });
  const result = await pending;
  Object.assign(screen, {
    getPathname: pending.getPathname,
    getSegments: pending.getSegments,
    getSearchParams: pending.getSearchParams,
    getPathnameWithParams: pending.getPathnameWithParams,
  });
  return result;
}
