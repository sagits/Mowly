/** Whether the demo user is signed in. Not persisted: both apps boot signed in. */
import { create } from 'zustand';

/** Session state and its two transitions. */
export type SessionState = { signedIn: boolean; signIn(): void; signOut(): void };

/** Hook over the session store; also `useSession.getState()` outside React. */
export const useSession = create<SessionState>((set) => ({
  signedIn: true,
  signIn: () => set({ signedIn: true }),
  signOut: () => set({ signedIn: false }),
}));
