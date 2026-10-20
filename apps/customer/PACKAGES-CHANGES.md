# Package changes (customer track)

No changes under `packages/` so far.

App-local note: `apps/customer/jest.setup.ts` now mocks `react-native-worklets` and calls Reanimated's `setUpTests()` (needed by `SizingRing`).
