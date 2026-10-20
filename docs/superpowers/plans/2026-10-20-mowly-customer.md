# Mowly (Customer Track) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every customer screen of Mowly on top of the foundation. That covers the quote funnel from service select to a booking in My Services (ticket 2), then Browse, My Services, Service detail and Inbox (ticket 3), then the management sheets, chat and Profile.

**Architecture:** Screens live in `apps/customer/app` (Expo Router files) and app-only pieces live in `apps/customer/src`. The funnel is a `quote/` stack presented full screen over the tabs. Its in-progress state is the app-local Zustand store `useQuoteDraft`. All data comes through `@mowly/api` hooks, and writes go through mutations that invalidate their queries. Screen tests render the real route tree with `renderApp(url)` (foundation Task 8).

**Tech Stack:** As the foundation plan. React Hook Form + Zod schemas from `@mowly/types`, `react-native-svg` + Reanimated for the sizing ring, Ionicons.

**Spec:** `PRD.md` ("Features: customer", "Design", "Navigation"), the screenshots `screenshots/clients-app/NN-*.jpg|png` (C01 to C21), and `prototype/index.html` for invented screens.

**Prerequisite:** The foundation plan is complete on `master`. This plan runs in its own worktree on branch `track/customer` (`superpowers:using-git-worktrees`), at the same time as the pro track. Run `pnpm install` once in the worktree, then `pnpm e2e:build` in the background (customer only: `pnpm --filter @mowly/customer e2e:build`).

## Global Constraints

- Everything in the foundation plan's Global Constraints applies
- Touch `packages/` only additively (a new component, a new resolver, a new optional field). Never edit or rename something the pro track may use. List every such change in `apps/customer/PACKAGES-CHANGES.md`
- GitHub issues: the last commit of each ticket carries a `Closes #N` trailer for #2 (Task 7), #3 (Task 10) and #7 (Task 14), exactly as written in those commit steps. Do not push the track branch. The issues close when the integration plan pushes `master`
- `DECISIONS.md` entries start with `[customer]`
- Simulator `iPhone 16`, Metro 8081. Run a flow with `scripts/e2e.sh customer apps/customer/.maestro/<flow>.yaml`
- Screen tests live in `apps/customer/tests/` (never under `app/`, where a file becomes a route). Run with `pnpm --filter @mowly/customer test <file>`
- Buttons and green links use uppercase labels (`CONTINUE`, `BOOK NOW`, `ADD A PROMO CODE`). The `Button` component already uppercases
- **Every feature task ends with the same three closing steps**, written out per task below:
  1. Write or extend the task's Maestro flow (main path and outcome only, selected by `id`) and run it. Expected: PASS
  2. **Fidelity check:** `xcrun simctl io "iPhone 16" screenshot /tmp/mowly-<screen>.png`, then compare it side by side with the named reference screenshots. List every visible difference (spacing, color, copy, icon, missing element), then fix it or record it in `DECISIONS.md` as a screenshot simplification. Invented screens are compared with `prototype/index.html`
  3. Commit, with no attribution trailer

## Review Focus

- **Going back inside the funnel and picking a different service** must reset the plan choice and promo (the old Weekly $57 must not carry into Leaf Removal), while keeping the contact details. This is tested in Task 1 (store) and Task 5
- **Double-tapping BOOK NOW** must create exactly one booking. The button is disabled while the mutation is pending. This is tested in Task 7
- **Starting a second quote after booking** must open a clean funnel (no selected service, plan or promo). This is tested in Task 7
- **Promo with a frequency change:** $5 off stays applied when the plan changes, and the price never goes below $0. This is tested in Task 5
- **Typing in the address field after picking a suggestion** clears the pick, so the form blocks with "Pick an address from the list". This is tested in Task 2

---

## Ticket 2: Quote funnel end to end

### Task 1: Quote draft store, funnel stack and Service select (C01, C02, C03)

**Files:**
- Create: `apps/customer/src/stores/useQuoteDraft.ts`, `apps/customer/src/components/FunnelHeader.tsx`, `apps/customer/app/quote/_layout.tsx`, `apps/customer/app/quote/index.tsx`, `apps/customer/.maestro/quote-funnel.yaml`
- Modify: `apps/customer/app/_layout.tsx` (register `quote` with `presentation: 'fullScreenModal'`, `headerShown: false`)
- Test: `apps/customer/tests/useQuoteDraft.test.ts`, `apps/customer/tests/service-select.test.tsx`

**Interfaces:**
- Consumes: `useServices`, `useCustomer`, `Button`, `Wordmark`, `Screen`
- Produces:

```ts
type QuoteDraft = {
  serviceId: ServiceId | null; contact: QuoteContactInput | null; frequency: Frequency | null;
  startDate: IsoDate | null; promoApplied: boolean;
  selectService(id: ServiceId): void; // a different id clears frequency, startDate and promoApplied; contact stays
  setContact(contact: QuoteContactInput): void; choosePlan(frequency: Frequency): void;
  setStartDate(date: IsoDate): void; applyPromo(): void; reset(): void;
};
export const useQuoteDraft: UseBoundStore<StoreApi<QuoteDraft>>;
```
  - `FunnelHeader()`: `Wordmark` on the left, a green phone icon on the right, and a home icon with the street address below (the draft contact's `addressText`, falling back to the customer's address `line1`)
  - Service select testIDs: `service-tile-<serviceId>` and `quote-continue`. Copy: "Get started with Mowly!" and "What are you looking for?"

- [ ] **Step 1: Write the failing tests**

```ts
// useQuoteDraft.test.ts
beforeEach(() => useQuoteDraft.getState().reset());
test('a different service clears the plan and promo but keeps the contact', () => {
  const s = useQuoteDraft.getState();
  s.selectService('mowing'); s.setContact(contact); s.choosePlan('weekly'); s.applyPromo();
  s.selectService('leaf-removal');
  expect(useQuoteDraft.getState()).toMatchObject({ serviceId: 'leaf-removal', frequency: null, promoApplied: false, contact });
});
test('reselecting the same service keeps the plan', () => { /* choosePlan then selectService same id → frequency kept */ });
```

```tsx
// service-select.test.tsx
test('Continue unlocks after picking a service and opens the quote form', async () => {
  await renderApp('/quote');
  await screen.findByTestId('service-tile-mowing');
  expect(screen.getAllByTestId(/^service-tile-/)).toHaveLength(11);
  expect(screen.getByTestId('quote-continue')).toBeDisabled();
  fireEvent.press(screen.getByTestId('service-tile-mowing'));
  fireEvent.press(screen.getByTestId('quote-continue'));
  expect(screen).toHavePathname('/quote/details');
  expect(useQuoteDraft.getState().serviceId).toBe('mowing');
});
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/customer test useQuoteDraft service-select`. Expected: FAIL
- [ ] **Step 3: Implement.** A selected tile gets the `primaryTint` background and a green outline check (Ionicons `checkmark-circle-outline`) on the right. Tiles are `surfaceMuted`. The list scrolls (C02). Create `quote/details.tsx` as a one-line placeholder so the push resolves
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Maestro.** Write `quote-funnel.yaml`: run `common/launch.yaml`, `openLink: mowly://quote`, tap `service-tile-mowing`, tap `quote-continue`, then `assertVisible: { id: quote-name }` (it starts passing in Task 2. Until then assert the placeholder's id). Run `scripts/e2e.sh customer apps/customer/.maestro/quote-funnel.yaml`. Expected: PASS
- [ ] **Step 6: Fidelity check** against C01, C02 and C03
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): quote draft store and service select" -m "Refs #2"`

### Task 2: Quote form (C04, C05, C06)

**Files:**
- Create: `apps/customer/app/quote/details.tsx` (replaces the placeholder), `apps/customer/src/components/AddressAutocomplete.tsx`
- Test: `apps/customer/tests/quote-form.test.tsx`

**Interfaces:**
- Consumes: `QuoteContactSchema`, `useAddressSearch`, `useCustomer`, `useService`, `FormField`, `TextField`, `useQuoteDraft`
- Produces:
  - Form testIDs: `quote-name`, `quote-address`, `quote-apt`, `quote-phone`, `quote-continue`. Suggestions are `address-option-<addressId>`
  - `AddressAutocomplete({ value, onChangeText, onPick, error, testID })`. Typing calls `onChangeText` and filters with `useAddressSearch`. Picking calls `onPick(address)` and closes the dropdown. The form clears `addressId` on every keystroke and sets it on pick, with `addressText` = `line1, city, state zip`
  - Copy: "Let's get your {Service} quote", "We need some details to provide a price estimate.", the consent paragraph with inert "terms of service" and "privacy policy" links in `link` color, and a lock icon with "Your information is safe & secure"
  - Defaults come from `draft.contact`, else from the customer (name, demo address id and text, phone)

- [ ] **Step 1: Write the failing tests**

```tsx
beforeEach(() => useQuoteDraft.getState().selectService('mowing'));
test('prefilled, so Continue goes straight to sizing', async () => {
  await renderApp('/quote/details');
  expect(await screen.findByDisplayValue('Renato Probst')).toBeTruthy();
  fireEvent.press(screen.getByTestId('quote-continue'));
  await waitFor(() => expect(screen).toHavePathname('/quote/sizing'));
  expect(useQuoteDraft.getState().contact?.addressId).toBe('addr-maple-ridge');
});
test('typing after a pick blocks until a suggestion is picked again', async () => {
  await renderApp('/quote/details');
  fireEvent.changeText(await screen.findByTestId('quote-address'), '1820 Maple');
  fireEvent.press(screen.getByTestId('quote-continue'));
  expect(await screen.findByText('Pick an address from the list')).toBeTruthy();
  fireEvent.press(await screen.findByTestId('address-option-addr-maple-ridge'));
  fireEvent.press(screen.getByTestId('quote-continue'));
  await waitFor(() => expect(screen).toHavePathname('/quote/sizing'));
});
test('a short phone shows its error', async () => { /* changeText quote-phone '555' → 'Enter a 10-digit phone number' */ });
test('the title names the service', async () => { /* findByText("Let's get your Mowing quote") */ });
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/customer test quote-form`. Expected: FAIL
- [ ] **Step 3: Implement.** Use `useForm({ resolver: zodResolver(QuoteContactSchema) })`, and on valid submit call `setContact` then `router.push('/quote/sizing')`. Create `quote/sizing.tsx` as a placeholder
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Maestro.** Extend `quote-funnel.yaml`: after service select, tap `quote-continue`, then `assertVisible: { id: sizing-screen }` (the Task 2 placeholder carries that id). Run it. Expected: PASS
- [ ] **Step 6: Fidelity check** against C04, C05 (dropdown open, green focused border) and C06
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): quote form with address autocomplete" -m "Refs #2"`

### Task 3: Lawn sizing (C07)

**Files:**
- Create: `apps/customer/app/quote/sizing.tsx`, `apps/customer/src/components/SizingRing.tsx`
- Test: `apps/customer/tests/sizing.test.tsx`

**Interfaces:**
- Consumes: `useNeighbors(zip)`, `AERIAL_IMAGE`, `useQuoteDraft`
- Produces:
  - `SIZING_MS = 3000`
  - `SizingRing({ durationMs }: { durationMs: number })`: the circular `AERIAL_IMAGE` with a green SVG ring whose `strokeDashoffset` animates from full to zero over `durationMs` (Reanimated `useAnimatedProps`)
  - Screen testIDs: `sizing-screen` and `sizing-neighbors`. Copy: "We're sizing your lawn with satellite precision!" and "Join **{n} neighbors** in {zip} who've booked Mowly", with the count in green bold. The ZIP comes from the draft contact's address. The screen has no header (`headerShown: false`) and calls `router.replace('/quote/plan')` after `SIZING_MS`

- [ ] **Step 1: Write the failing test**

```tsx
test('shows the neighbor count and moves on after three seconds', async () => {
  jest.useFakeTimers();
  useQuoteDraft.getState().selectService('mowing');
  useQuoteDraft.getState().setContact({ name: 'Renato Probst', addressId: 'addr-maple-ridge', addressText: '1820 Maple Ridge Drive, Austin, TX 78704', apt: '', phone: '5125550147' });
  await renderApp('/quote/sizing');
  expect(await screen.findByTestId('sizing-neighbors')).toHaveTextContent('Join 49 neighbors in 78704');
  act(() => jest.advanceTimersByTime(3000));
  await waitFor(() => expect(screen).toHavePathname('/quote/plan'));
  jest.useRealTimers();
});
```
- [ ] **Step 2: Run to verify it fails.** Expected: FAIL. If Reanimated needs its Jest setup, add `require('react-native-reanimated').setUpTests()` to `apps/customer/jest.setup.ts` and note it in `PACKAGES-CHANGES.md` (it is app-local, but note it anyway)
- [ ] **Step 3: Implement.** Create `quote/plan.tsx` as a placeholder with testID `plan-screen`
- [ ] **Step 4: Run to verify it passes.** Expected: PASS
- [ ] **Step 5: Maestro.** Extend `quote-funnel.yaml`: `extendedWaitUntil: { visible: { id: plan-screen }, timeout: 15000 }`. Run it. Expected: PASS
- [ ] **Step 6: Fidelity check** against C07, and watch it once to confirm the ring animates
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): animated lawn sizing screen" -m "Refs #2"`

### Task 4: Policy FAQ modal (C16, C17)

**Files:**
- Create: `apps/customer/app/quote/faq.tsx`, `apps/customer/src/content/policyFaq.ts`
- Modify: `apps/customer/app/quote/_layout.tsx` (`faq` with `presentation: 'modal'`)
- Test: `apps/customer/tests/policy-faq.test.tsx`

**Interfaces:**
- Produces: `POLICY_FAQ: { question: string; answer: string }[]`, with the 7 questions and answers transcribed from C16 and C17 and every brand name replaced with Mowly. Screen testIDs are `faq-item-<index>` (`Accordion`) and `faq-ok`. The large title is "Frequent Questions about our Policies". OK calls `router.back()`

- [ ] **Step 1: Write the failing test**

```tsx
test('seven questions that expand, and OK closes', async () => {
  await renderApp('/quote/plan'); // gives OK a screen to go back to
  router.push('/quote/faq');
  await screen.findByTestId('faq-item-0');
  expect(screen.getAllByTestId(/^faq-item-\d+$/)).toHaveLength(7);
  fireEvent.press(screen.getByTestId('faq-item-2-header'));
  expect(screen.getByTestId('faq-item-2-body')).toBeTruthy();
  fireEvent.press(screen.getByTestId('faq-ok'));
  await waitFor(() => expect(screen).toHavePathname('/quote/plan'));
});
```
- [ ] **Step 2: Run to verify it fails.** Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify it passes.** Expected: PASS
- [ ] **Step 5: Maestro.** No flow of its own. Task 5's flow opens and closes it
- [ ] **Step 6: Fidelity check** against C16 and C17
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): policy FAQ modal" -m "Refs #2"`

### Task 5: Pick your plan (C08 to C12)

**Files:**
- Create: `apps/customer/app/quote/plan.tsx` (replaces the placeholder), `apps/customer/src/pricing.ts`, `apps/customer/src/components/{PlanRow,CostFooter,DateSheet,PromoSheet}.tsx`
- Test: `apps/customer/tests/pricing.test.ts`, `apps/customer/tests/pick-plan.test.tsx`

**Interfaces:**
- Consumes: `useQuote(serviceId, addressId)`, `useService`, `useQuoteDraft`, `nextWeekday`, `addDays`, `formatLong`, `formatMoney`, `BottomSheet`, `Skeleton`, `Button`
- Produces:
  - `PROMO_DISCOUNT = 5`, `TRUST_FEE = 3.99`, `costPerService(price: number, promoApplied: boolean): number` (= `Math.max(0, price - (promoApplied ? PROMO_DISCOUNT : 0))`)
  - `PlanRow({ plan, selected, onPress, testID })`: the label on the left and a price block on the right ("$57" large, "per service" small). Selected is `primaryTint` with a green price block. Unselected uses a `priceBlock` cell. A recommended plan has a green "Recommended" tab above it. Reused by Task 11
  - `CostFooter({ price, cta, onPress, disabled?, loading?, testID })`: sticky, with "Cost per service" and the price (testID `cost-per-service`), "+ $3.99 Trust & Safety Fee" and the CTA. Reused by Task 7
  - `DateSheet({ visible, onClose, value, onPick, testID })`: the next 14 days starting at `nextWeekday()`, with row testIDs `date-option-<iso>`. Reused by Task 11
  - `PromoSheet({ visible, onClose, onApplied })`: the "Add Promo Code" modal (C11) with input `promo-input` and `promo-apply`, which stays disabled until there is text. Any code applies
  - Plan screen testIDs: `plan-screen`, `plan-loading` (skeleton while the quote loads, C08), `plan-row-<frequency>`, `plan-start-date`, `promo-open`, `promo-applied` ("Code applied"), `plan-faq-link`, `plan-not-looking`, `quote-continue`
  - On load with no draft frequency, it selects the recommended plan and sets the start date to `nextWeekday()`. CONTINUE shows the in-button spinner for 800 ms (C12 shows it; there is nothing to wait for, so mark it `// ponytail:`), then pushes `/quote/account`. "I'm not looking for {Service}" replaces with `/quote`. The FAQ link pushes `/quote/faq`

- [ ] **Step 1: Write the failing tests**

```ts
// pricing.test.ts
test('promo takes five off and never goes negative', () => {
  expect(costPerService(57, false)).toBe(57);
  expect(costPerService(57, true)).toBe(52);
  expect(costPerService(3, true)).toBe(0);
});
```

```tsx
// pick-plan.test.tsx (beforeEach: selectService('mowing') and setContact(demo contact))
test('recommended weekly is preselected at $57', async () => {
  await renderApp('/quote/plan');
  await screen.findByTestId('plan-row-weekly');
  expect(screen.getByTestId('cost-per-service')).toHaveTextContent('$57');
  expect(useQuoteDraft.getState().startDate).toBe('2026-10-21');
});
test('promo stays applied across a plan change', async () => {
  await renderApp('/quote/plan');
  fireEvent.press(await screen.findByTestId('promo-open'));
  fireEvent.changeText(screen.getByTestId('promo-input'), 'SPRING');
  fireEvent.press(screen.getByTestId('promo-apply'));
  fireEvent.press(screen.getByTestId('plan-row-monthly'));
  expect(screen.getByTestId('cost-per-service')).toHaveTextContent('$55');
  expect(screen.getByTestId('promo-applied')).toBeTruthy();
});
test('the date sheet lists 14 days from the next weekday', async () => { /* open plan-start-date; date-option-2026-10-21 present; date-option-2026-11-03 present; date-option-2026-11-04 absent */ });
test('not looking goes back to service select', async () => { /* press plan-not-looking → pathname '/quote' */ });
test('continue spins then opens the account step', async () => { /* press quote-continue → quote-continue-spinner, then pathname '/quote/account' */ });
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/customer test pricing pick-plan`. Expected: FAIL
- [ ] **Step 3: Implement.** The "What's included?" callout uses `callout` with a bulb icon and the service's `included` bullet. "Have additional questions? Read our Frequently Asked Questions" uses `link` color. Create `quote/account.tsx` as a placeholder with testID `account-screen`
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Maestro.** Extend `quote-funnel.yaml`: tap `plan-row-monthly`, tap `plan-faq-link`, tap `faq-ok`, tap `quote-continue`, then `assertVisible: { id: account-screen }`. Run it. Expected: PASS
- [ ] **Step 6: Fidelity check** against C08, C09, C10, C11 and C12
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): pick your plan with promo, start date and cost footer" -m "Refs #2"`

### Task 6: My Services list (C19)

**Files:**
- Create: `apps/customer/src/components/BookingCard.tsx`, `apps/customer/app/service/[id].tsx` (placeholder showing the service name, testID `service-detail`)
- Modify: `apps/customer/app/(tabs)/services.tsx`
- Test: `apps/customer/tests/my-services.test.tsx`

**Interfaces:**
- Consumes: `useBookings`, `Badge`, `Skeleton`, `HeaderBand`, `formatLong`, `FREQUENCY_LABELS`
- Produces:
  - `BookingCard({ booking, onPress })`, testID `booking-card-<id>`: green left border, service name, a green "Scheduled" chip (gray "Paused" when paused), a calendar icon with "Next service {formatLong}", a clock icon with the frequency label, and a chevron
  - Screen testIDs: `screen-services` (kept), `services-loading`, `services-empty` with "No services yet" and a `services-get-quote` button that pushes `/quote` after `useQuoteDraft.reset()`

- [ ] **Step 1: Write the failing tests**

```tsx
test('lists the two seeded bookings in order and opens one', async () => {
  await renderApp('/services');
  expect(screen.getByTestId('services-loading')).toBeTruthy();
  await screen.findByTestId('booking-card-b-mowing');
  expect(screen.getAllByTestId(/^booking-card-/).map((n) => n.props.testID)).toEqual(['booking-card-b-mowing', 'booking-card-b-treatment']);
  expect(screen.getByTestId('booking-card-b-mowing')).toHaveTextContent(/Next service Sunday, October 25/);
  fireEvent.press(screen.getByTestId('booking-card-b-mowing'));
  await waitFor(() => expect(screen).toHavePathname('/service/b-mowing'));
});
test('empty state', async () => {
  configureMocks({ seed: false }); resetDb();
  await renderApp('/services');
  expect(await screen.findByTestId('services-empty')).toBeTruthy();
  configureMocks({ seed: true });
});
```
- [ ] **Step 2: Run to verify they fail.** Expected: FAIL. (The test delay is 0, so render `services-loading` while `isPending`, and the first synchronous assertion still sees it)
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Maestro.** Write `my-services.yaml`: launch, tap `tab-services`, `assertVisible: { id: booking-card-b-mowing }`, tap it, `assertVisible: { id: service-detail }`. Run it. Expected: PASS
- [ ] **Step 6: Fidelity check** against C19, rebuilt in the iOS visual language of C01 to C17 (PRD "Sources")
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): My Services list" -m "Refs #2"`

### Task 7: Create your account, BOOK NOW and confirmation (C13, C14, C15)

**Files:**
- Create: `apps/customer/app/quote/account.tsx` (replaces the placeholder), `apps/customer/app/quote/booked.tsx`
- Modify: `apps/customer/app/quote/_layout.tsx` (`account` uses the native header: `headerShown: true`, empty title, `primary` tint)
- Test: `apps/customer/tests/create-account.test.tsx`

**Interfaces:**
- Consumes: `AccountSchema`, `DEMO_CARD`, `useCreateBooking`, `useQuote`, `useService`, `useQuoteDraft`, `costPerService`, `CostFooter`, `Checkbox`, `FormField`
- Produces:
  - Account testIDs: `account-screen`, `account-first`, `account-last`, `account-email`, `account-card-number`, `account-card-expiry`, `account-card-cvc` (prefilled with `DEMO_CARD`, `12 / 34`, `123`, with the line "Demo card, nothing is charged"), `account-terms`, `account-faq-link`, `book-now`. The page also has the "Inspect First, Pay Later Promise" card, the card copy, and the policy summary card from C15
  - BOOK NOW stays disabled until `formState.isValid` (`mode: 'onChange'`) and while the mutation is pending. On press it calls `createBooking({ serviceId, frequency, price: costPerService(plan.price, promoApplied), startDate, addressId })`, then `router.replace({ pathname: '/quote/booked', params: { id } })`
  - Booked screen (invented, prototype "You're booked!") testIDs: `booked-screen`, `booked-go`. It shows a green check, "You're booked!", the service, plan and first date. `booked-go` calls `useQuoteDraft.reset()`, `router.dismissAll()`, then `router.replace('/services')`

- [ ] **Step 1: Write the failing tests**

```tsx
// beforeEach: draft = leaf-removal, demo contact, one-time, startDate '2026-10-21'
const fill = () => {
  fireEvent.changeText(screen.getByTestId('account-first'), 'Renato');
  fireEvent.changeText(screen.getByTestId('account-last'), 'Probst');
  fireEvent.changeText(screen.getByTestId('account-email'), 'renato@example.com');
};
test('BOOK NOW unlocks only with a valid form and the terms box', async () => {
  await renderApp('/quote/account');
  await screen.findByTestId('book-now');
  expect(screen.getByTestId('book-now')).toBeDisabled();
  fill();
  await waitFor(() => expect(screen.getByTestId('book-now')).toBeDisabled());
  fireEvent.press(screen.getByTestId('account-terms'));
  await waitFor(() => expect(screen.getByTestId('book-now')).toBeEnabled());
});
test('booking lands on top of My Services, once, with a clean funnel after', async () => {
  await renderApp('/quote/account');
  await screen.findByTestId('book-now'); fill(); fireEvent.press(screen.getByTestId('account-terms'));
  await waitFor(() => expect(screen.getByTestId('book-now')).toBeEnabled());
  fireEvent.press(screen.getByTestId('book-now'));
  fireEvent.press(screen.getByTestId('book-now'));
  fireEvent.press(await screen.findByTestId('booked-go'));
  await waitFor(() => expect(screen).toHavePathname('/services'));
  const cards = await screen.findAllByTestId(/^booking-card-/);
  expect(cards).toHaveLength(3);
  expect(cards[0]).toHaveTextContent(/Leaf Removal/);
  expect(useQuoteDraft.getState()).toMatchObject({ serviceId: null, frequency: null, promoApplied: false });
});
```
- [ ] **Step 2: Run to verify they fail.** Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Maestro.** Finish `quote-funnel.yaml`: tap and type into `account-first`, `account-last` and `account-email`, tap `account-terms`, tap `book-now`, tap `booked-go`, then `assertVisible: { id: screen-services }` and `assertVisible: "Mowing"`. Run it. Expected: PASS. **Ticket 2 is done:** run `pnpm test && pnpm typecheck` and the whole `scripts/e2e.sh customer`
- [ ] **Step 6: Fidelity check** against C13, C14 and C15. Compare the booked screen with the prototype
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): create account, book now and confirmation" -m "Closes #2"`

---

## Ticket 3: Browse, Service detail, Inbox

### Task 8: Browse (C18)

**Files:**
- Modify: `apps/customer/app/(tabs)/index.tsx`
- Create: `apps/customer/src/components/{CustomerHeader,AddressSwitcher,RecommendedCarousel,ServiceExploreRow}.tsx`, `apps/customer/.maestro/demo.yaml`
- Test: `apps/customer/tests/browse.test.tsx`

**Interfaces:**
- Consumes: `useServices`, `useCustomer`, `serviceImage`, `HeaderBand`, `BottomSheet`, `SwitchAppLink`, `useQuoteDraft`
- Produces:
  - `CustomerHeader({ title })`: a `HeaderBand` with the title, a gift icon (inert), `SwitchAppLink` on web, and the row below with a home icon, the address `line1` and a chevron opening `AddressSwitcher` (testID `address-switcher`; the sheet lists the one address plus an inert "Add address"). It is reused by the My Services, Inbox and Profile tabs (swap their placeholder headers for it in this task)
  - `RecommendedCarousel`: a horizontal paging `ScrollView` with page dots and 3 cards (Take a break / `leaf-removal`, Keep it green / `lawn-treatment`, Bite-free summer / `mosquito-prevention`). Card testIDs are `browse-reco-<serviceId>`, and each GET A QUOTE pill is `browse-reco-<serviceId>-quote`
  - `ServiceExploreRow`, testID `browse-service-<serviceId>`: photo, title, one line from `included`, and a VIEW PRICE outline pill (`browse-view-price-<serviceId>`). All 11 services are listed
  - Both GET A QUOTE and VIEW PRICE run `reset()`, `selectService(id)`, then `router.push('/quote/details')`, skipping service select

- [ ] **Step 1: Write the failing tests**

```tsx
test('View price skips service select with the service chosen', async () => {
  await renderApp('/');
  fireEvent.press(await screen.findByTestId('browse-view-price-leaf-removal'));
  await waitFor(() => expect(screen).toHavePathname('/quote/details'));
  expect(useQuoteDraft.getState().serviceId).toBe('leaf-removal');
});
test('three recommended cards and the address switcher', async () => {
  await renderApp('/');
  expect(await screen.findAllByTestId(/^browse-reco-[a-z-]+$/)).toHaveLength(3);
  fireEvent.press(screen.getByTestId('address-switcher'));
  expect(await screen.findByText('1820 Maple Ridge Drive')).toBeTruthy();
});
```
- [ ] **Step 2: Run to verify they fail.** Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Maestro.** Write `demo.yaml`, the PRD demo flow's customer half: launch, tap `browse-view-price-leaf-removal`, `quote-continue`, wait for `plan-screen`, `quote-continue`, fill account, `account-terms`, `book-now`, `booked-go`, `assertVisible: "Leaf Removal"`, then tap the first `booking-card-.*` and `assertVisible: { id: service-detail }`. `quote-funnel.yaml` keeps its `openLink: mowly://quote` entry so it still covers service select. Run both. Expected: PASS
- [ ] **Step 6: Fidelity check** against C18 (rebuilt in iOS language)
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): Browse with recommendations and services to explore" -m "Refs #3"`

### Task 9: Service detail (C20)

**Files:**
- Modify: `apps/customer/app/service/[id].tsx`, `apps/customer/app/_layout.tsx` (the `service/[id]` header: `primaryHeader` background, white tint, and a custom `headerTitle` with the service name over the address, plus a `?` help icon on the right)
- Test: `apps/customer/tests/service-detail.test.tsx`

**Interfaces:**
- Consumes: `useBooking(id)`, `useService`, `Badge`, `ListRow`, `formatLong`, `formatMoney`
- Produces: screen testID `service-detail`. The "Upcoming Service" block holds the chip, "{formatLong(nextDate)} ({frequency label})", "{formatMoney(price)} per service" and the pro name, followed by "What's included?". Action rows are `detail-skip`, `detail-reschedule`, `detail-frequency`, `detail-pause` and `detail-cancel` (labels from the PRD). Their `onPress` is wired in Task 11 and is a no-op until then

- [ ] **Step 1: Write the failing test**

```tsx
test('shows the seeded mowing booking', async () => {
  await renderApp('/service/b-mowing');
  expect(await screen.findByText('$53.00 per service')).toBeTruthy();
  expect(screen.getByText('Greenleaf Lawn Co.')).toBeTruthy();
  expect(screen.getByText('Sunday, October 25 (Monthly)')).toBeTruthy();
  for (const id of ['skip', 'reschedule', 'frequency', 'pause', 'cancel']) expect(screen.getByTestId(`detail-${id}`)).toBeTruthy();
});
```
- [ ] **Step 2: Run to verify it fails.** Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify it passes.** Expected: PASS
- [ ] **Step 5: Maestro.** Extend `my-services.yaml`: after opening the detail, `assertVisible: "Greenleaf Lawn Co."`. Run it. Expected: PASS
- [ ] **Step 6: Fidelity check** against C20
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): service detail" -m "Refs #3"`

### Task 10: Inbox list (C21)

**Files:**
- Modify: `apps/customer/app/(tabs)/inbox.tsx`
- Create: `apps/customer/src/components/ThreadRow.tsx`, `apps/customer/app/chat/[id].tsx` (placeholder, testID `chat-screen`), `apps/customer/.maestro/inbox.yaml`
- Test: `apps/customer/tests/inbox.test.tsx`

**Interfaces:**
- Consumes: `useThreads`, `formatShort`
- Produces: `ThreadRow({ thread, onPress })`, testID `thread-<id>`: an initials avatar on `primaryTint`, the pro name, the service, the last message preview (one line), the date and a chevron. The screen has `inbox-loading` and `inbox-empty` states. Tapping pushes `/chat/<id>`

- [ ] **Step 1: Write the failing tests**

```tsx
test('one thread, last message from the pro, opens chat', async () => {
  await renderApp('/inbox');
  const row = await screen.findByTestId('thread-t-greenleaf');
  expect(row).toHaveTextContent(/GL/); expect(row).toHaveTextContent(/Greenleaf Lawn Co\./);
  fireEvent.press(row);
  await waitFor(() => expect(screen).toHavePathname('/chat/t-greenleaf'));
});
test('empty inbox', async () => { /* seed false → inbox-empty */ });
```
- [ ] **Step 2: Run to verify they fail.** Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Maestro.** `inbox.yaml`: launch, tap `tab-inbox`, tap `thread-t-greenleaf`, `assertVisible: { id: chat-screen }`. Run it. Expected: PASS. **Ticket 3 is done:** run `pnpm test && pnpm typecheck && scripts/e2e.sh customer`
- [ ] **Step 6: Fidelity check** against C21
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): inbox list" -m "Closes #3"`

---

## After that

### Task 11: Service management sheets (invented)

**Files:**
- Create: `apps/customer/src/components/ManageSheets.tsx`, `apps/customer/.maestro/manage-service.yaml`
- Modify: `apps/customer/app/service/[id].tsx`
- Test: `apps/customer/tests/manage-service.test.tsx`

**Interfaces:**
- Consumes: `useUpdateBooking`, `useQuote(booking.serviceId, booking.address.id)`, `ConfirmDialog`, `BottomSheet`, `DateSheet`, `PlanRow`, `addDays`, `today`
- Produces: `ManageSheets({ booking, open, onClose }: { open: 'skip' | 'reschedule' | 'frequency' | 'pause' | 'cancel' | null; … })`
  - Skip: `ConfirmDialog` (`destructive={false}`, confirm testID `skip-confirm`) runs `{ type: 'skip' }`
  - Reschedule: `DateSheet` runs `{ type: 'reschedule', date }`
  - Frequency: a sheet of `PlanRow`s (`frequency-<f>`) plus `frequency-save`, which runs `{ type: 'frequency', frequency, price }`
  - Pause: a sheet with the first day of each of the next 6 months (`pause-month-<YYYY-MM>`), which runs `{ type: 'pause', until: 'YYYY-MM-01' }`. The chip becomes "Paused until {Month}"
  - Cancel: `ConfirmDialog` (destructive, `cancel-confirm`) runs `{ type: 'cancel' }`, then `router.back()`

- [ ] **Step 1: Write the failing tests**

```tsx
test('skip moves the date by the frequency', async () => {
  await renderApp('/service/b-mowing');
  fireEvent.press(await screen.findByTestId('detail-skip'));
  fireEvent.press(screen.getByTestId('skip-confirm'));
  expect(await screen.findByText('Tuesday, November 24 (Monthly)')).toBeTruthy();
});
test('cancel removes it from My Services', async () => {
  await renderApp('/services');
  fireEvent.press(await screen.findByTestId('booking-card-b-mowing'));
  fireEvent.press(await screen.findByTestId('detail-cancel'));
  fireEvent.press(screen.getByTestId('cancel-confirm'));
  await waitFor(() => expect(screen).toHavePathname('/services'));
  await waitFor(() => expect(screen.queryByTestId('booking-card-b-mowing')).toBeNull());
});
test('pause shows Paused', async () => { /* detail-pause → pause-month-2026-12 → findByText(/Paused/) */ });
test('change frequency updates the label', async () => { /* detail-frequency → frequency-every-2-weeks → frequency-save → findByText(/Every 2 Weeks/) */ });
test('reschedule picks a date', async () => { /* detail-reschedule → date-option-2026-10-28 → findByText(/Wednesday, October 28/) */ });
```
- [ ] **Step 2: Run to verify they fail.** Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Maestro.** `manage-service.yaml`: open `booking-card-b-mowing`, skip and confirm, `assertVisible: "Tuesday, November 24 (Monthly)"`, then cancel and confirm, and `assertNotVisible: { id: booking-card-b-mowing }`. Run it. Expected: PASS
- [ ] **Step 6: Fidelity check** against the prototype
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): skip, reschedule, frequency, pause and cancel" -m "Refs #7"`

### Task 12: Chat (invented)

**Files:**
- Modify: `apps/customer/app/chat/[id].tsx`
- Create: `apps/customer/.maestro/chat.yaml`
- Test: `apps/customer/tests/chat.test.tsx`

**Interfaces:**
- Consumes: `useThread(id)` (it polls while the last message is the customer's), `useSendMessage`
- Produces: native header titled with the pro name. Bubbles have testID `chat-message-<id>` (customer on the right in `primary`, pro on the left in `callout`), plus `chat-input` and `chat-send` (disabled when the input is blank). A send clears the input

- [ ] **Step 1: Write the failing test**

```tsx
test('sending appends, and the canned reply arrives', async () => {
  await renderApp('/chat/t-greenleaf');
  fireEvent.changeText(await screen.findByTestId('chat-input'), 'Can you come Friday?');
  fireEvent.press(screen.getByTestId('chat-send'));
  expect(await screen.findByText('Can you come Friday?')).toBeTruthy();
  expect(await screen.findByText("Thanks! We'll take care of it.", {}, { timeout: 4000 })).toBeTruthy();
});
```
- [ ] **Step 2: Run to verify it fails.** Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify it passes.** Expected: PASS
- [ ] **Step 5: Maestro.** `chat.yaml`: open the thread from `tab-inbox`, type, send, then `extendedWaitUntil: { visible: "Thanks! We'll take care of it.", timeout: 10000 }`. Run it. Expected: PASS
- [ ] **Step 6: Fidelity check** against the prototype
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): chat with a canned pro reply" -m "Refs #7"`

### Task 13: Profile and Reset demo (invented)

**Files:**
- Modify: `apps/customer/app/(tabs)/profile.tsx`
- Create: `apps/customer/.maestro/profile.yaml`
- Test: `apps/customer/tests/profile.test.tsx`

**Interfaces:**
- Consumes: `useCustomer`, `useResetDemo`, `ListRow`, `ConfirmDialog`, `showToast`, `CustomerHeader`
- Produces: the name and email at the top, then rows `profile-addresses`, `profile-payment` (subtitle "Demo card •••• 4242"), `profile-notifications`, `profile-help` (each inert apart from a toast "Not in this demo") and `profile-reset`. Reset opens a `ConfirmDialog` (`reset-confirm`), runs `useResetDemo`, then `showToast('Demo reset')`

- [ ] **Step 1: Write the failing test**

```tsx
test('reset demo brings back the seed', async () => {
  await createBooking({ serviceId: 'weeding', frequency: 'one-time', price: 59, startDate: '2026-10-21', addressId: 'addr-maple-ridge' });
  await renderApp('/profile');
  fireEvent.press(await screen.findByTestId('profile-reset'));
  fireEvent.press(screen.getByTestId('reset-confirm'));
  expect(await screen.findByText('Demo reset')).toBeTruthy();
  expect(await getBookings()).toHaveLength(2);
});
```
- [ ] **Step 2: Run to verify it fails.** Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify it passes.** Expected: PASS
- [ ] **Step 5: Maestro.** `profile.yaml`: tap `tab-profile`, `profile-reset`, `reset-confirm`, then `assertVisible: { id: toast }`. Run it. Expected: PASS
- [ ] **Step 6: Fidelity check** against P15's list style and the prototype
- [ ] **Step 7: Commit.** `git add apps/customer && git commit -m "feat(customer): profile with reset demo" -m "Refs #7"`

### Task 14: Track wrap-up

- [ ] **Step 1: Full check.** `pnpm test && pnpm typecheck && pnpm lint && scripts/e2e.sh customer`. Expected: all green
- [ ] **Step 2: Fidelity sweep.** Screenshot C01 to C21 once more and fix or record every remaining difference
- [ ] **Step 3: Web pass for this app.** `pnpm --filter @mowly/customer build:web`, serve it, then run the funnel with mouse and keyboard at phone and desktop width (tabs on the left at ≥ 768, funnel a centered column at every width). Fix the issues. Record any `.web.tsx` file and its reason in `DECISIONS.md` for the README
- [ ] **Step 4: Confirm `apps/customer/PACKAGES-CHANGES.md` lists every `packages/` change** (write "None" if there were none)
- [ ] **Step 5: Commit.** `git add -A && git commit -m "chore(customer): track wrap-up" -m "Closes #7"`
