# Package changes (customer track)

- `packages/types/src/dates.ts`: added export `dateOf(epochMs): IsoDate` (local calendar date of a timestamp; wraps the existing private `toIso`). Used by `ThreadRow`, needed by chat.

App-local note: `apps/customer/jest.setup.ts` now mocks `react-native-worklets` and calls Reanimated's `setUpTests()` (needed by `SizingRing`).
