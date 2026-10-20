# Package changes (customer track)

- `packages/types/src/dates.ts`: added export `dateOf(epochMs): IsoDate` (local calendar date of a timestamp; wraps the existing private `toIso`). Used by `ThreadRow`, needed by chat. `packages/types/src/dates.test.ts` gained a test for it.
- `packages/ui/src/BottomSheet.tsx`: new optional prop `avoidKeyboard` (default `false`), which lifts the panel above the iOS keyboard through a `KeyboardAvoidingView` that is disabled unless the prop is set. Used by `PromoSheet`, whose field and APPLY were hidden behind the keyboard.
- `packages/ui/src/Button.tsx`: new optional prop `size` (`'md'` default, `'sm'` compact pill). Used by Browse's VIEW PRICE and GET A QUOTE (C18).
- `packages/ui/src/Checkbox.tsx`: also passes `aria-checked={checked}` next to the existing `accessibilityState`, so the checked state reaches the DOM on web (react-native-web ignores `accessibilityState`). No API change.

App-local note: `apps/customer/jest.setup.ts` now mocks `react-native-worklets` and calls Reanimated's `setUpTests()` (needed by `SizingRing`).
