import { useSession } from './useSession';

test('sign out and back in', () => {
  useSession.getState().signOut();
  expect(useSession.getState().signedIn).toBe(false);
  useSession.getState().signIn();
  expect(useSession.getState().signedIn).toBe(true);
});
