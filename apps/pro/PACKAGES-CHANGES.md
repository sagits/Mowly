# Package changes made by the pro track

- `packages/mocks/src/seed.ts`: seed `skills` renamed to P05 names (`Lawn Mowing`, `Leaf Removal`, `Cleanup`). Value-only; customer tests pass.
- `apps/pro/jest.setup.ts` (app-local, not a package): `beforeEach` also calls `useSession.getState().signIn()`, because the session store defaults to signed in but keeps its state across tests once one signs out.
- Task 15 (all additive; customer tests pass):
  - `packages/mocks/src/db.ts`: new exported types `CrewMember`, `PerformanceStat`; new `MockDb` fields `crew`, `performance`, `proThreads` (also blanked when `seed: false`).
  - `packages/mocks/src/seed.ts`: seeds for those three fields (2 crew, 3 stats, 2 threads).
  - `packages/mocks/src/pro.ts`: new resolvers `getCrew`, `getPerformance`, `getProThreads`.
  - `packages/api/src/queryKeys.ts`: new keys `crew`, `performance`, `proThreads`.
  - `packages/api/src/pro.ts`: new hooks `useCrew`, `usePerformance`, `useProThreads`.
  - `packages/mocks/src/pro-extras.test.ts`: new test file.
