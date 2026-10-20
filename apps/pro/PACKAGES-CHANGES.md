# Package changes made by the pro track

- `packages/mocks/src/seed.ts`: seed `skills` renamed to P05 names (`Lawn Mowing`, `Leaf Removal`, `Cleanup`). Value-only; customer tests pass.
- `apps/pro/jest.setup.ts` (app-local, not a package): `beforeEach` also calls `useSession.getState().signIn()`, because the session store defaults to signed in but keeps its state across tests once one signs out.
